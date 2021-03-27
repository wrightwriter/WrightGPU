// import { initializeHTML } from "./initializeHTML"
 
export class WrGPU{
  
  private height: number = 0
  private width: number = 0

  public canvas: any 
  public adapter: GPUAdapter 
  public device: GPUDevice
  public context: GPUCanvasContext
  public renderPipeline: GPURenderPipeline = undefined

  constructor(width: number, height: number, canvas: any){
    this.height = height
    this.width = width
    this.canvas = canvas;
  }

  public async initializeGPU(){
    this.adapter = await navigator.gpu.requestAdapter();
    console.log(navigator)
    this.device = await this.adapter.requestDevice()
    this.context = this.canvas.getContext('gpupresent')

    if(!this.adapter || !this.device ){
      window.alert("Error in adapter or device setup.")
      return
    }

  }
  public async createTextureFromLink(link: string) : Promise<GPUTexture>{
    let tex: GPUTexture 
    await fetch(link)
      .then(res=>res.blob())
      .then(async img=>{
        const imageBitmap = await createImageBitmap(img);
        
        tex = this.device.createTexture({
          size: [imageBitmap.width, imageBitmap.height, 1],
          format: 'rgba8unorm',
          usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST
        })
        console.log("image!")
        console.log(imageBitmap)
        // console.log(tex)
        this.device.defaultQueue.copyImageBitmapToTexture(
          {imageBitmap},
          {texture: tex},
          [imageBitmap.width, imageBitmap.height, 1]
          )
        })
        // TODO: Falure to fetch
        return Promise.resolve(tex)
  }

  public createBuffer(
    { bufferDataArray, bufferUsage }: { bufferDataArray: Float32Array | Int32Array; bufferUsage: number }
    ) : GPUBuffer{

    const buffer: GPUBuffer = this.device.createBuffer({
      mappedAtCreation: true,
      size: ((bufferDataArray.byteLength + 3) & ~3),
      usage: bufferUsage
    })
    
    const arrayBuffer: ArrayBuffer = buffer.getMappedRange()

    new Float32Array(arrayBuffer).set(bufferDataArray)
    
    buffer.unmap()    

    return buffer
  }


}