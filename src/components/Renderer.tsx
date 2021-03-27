import * as React from "react";
import  { useState, useEffect, useRef } from 'react';
import { compilation } from "webpack";

import {definitions} from '../includes/definitions' 
import { Project } from "../includes/interfaces";
import {WrGPU} from '../includes/WrGPU'
import glslangModule from '../includes/glslang'

import * as blueImageLoader from "blueimp-load-image"



type RendererProps = {
  shouldReloadShaderSwitch: boolean,
  shouldReloadTextures: boolean, 
  shaderCode: string,
  projects: Object,
  currentProject: Project,
  time: number,
  setTime: Function,
  paused: boolean,
}

export default function Renderer ({shouldReloadShaderSwitch, shouldReloadTextures, shaderCode, projects, currentProject, time, setTime, paused}: RendererProps){
  const canvasRef = useRef(null)
  const [canvasProps, setCanvasProps] = useState({
    width: 300,
    height: 300,

  })

  let previousTime = useRef<number>(0);
  let gpuTextures = useRef<Array<GPUTexture>>(new Array(8));
  let compilationSuccess: boolean = false;
  let gpu = useRef<WrGPU>(null)
  let renderPipelineDescriptor = useRef<GPURenderPipelineDescriptor>(null)
  let renderPipeline = useRef<GPURenderPipeline>(null)

  const reloadShaders = async()=>{

    const glslang = await glslangModule();
    console.log("glslang", glslang)

      if(gpu.current && gpu.current.device){ // nasty
        
        let shader: GPUShaderModule = null;
        if(projects[currentProject.name].codeLanguage === "wgsl") {
          shader = gpu.current.device.createShaderModule({ code: shaderCode})
        } else {
          alert("GLSL")
          shader = gpu.current.device.createShaderModule({ 
            code: shaderCode, 
            // @ts-ignoreh
            transform: (glsl: string) => glslang.compileGLSL(glsl, 'fragment'),
          })
        }
        // const compilationInfo: GPUCompilationInfo = await shader.compilationInfo()
        // console.log(compilationInfo)
        if (shader){
          compilationSuccess = true;
          renderPipelineDescriptor.current.fragmentStage = {
            module: shader,
            entryPoint: 'main',
          }
          renderPipeline.current = gpu.current.device.createRenderPipeline(renderPipelineDescriptor.current)
        } else {
          compilationSuccess = false;
          
        }
        alert("compiling shaders")
        console.log(shaderCode)
        
        // console.log(renderPipelineDescriptor)
        // console.log(renderPipeline)
      }
  }
  useEffect(() => {
    (async () =>{

      const initialH: number = 470
      const initialW: number = 770

      setCanvasProps({
        width: initialW,
        height: initialH 
      })

      const g: WrGPU = new WrGPU(initialW, initialH, canvasRef.current)

      await g.initializeGPU()

      // console.log(canvasRef.current)
      // console.log(g)
      // console.log(definitions)
      // * Swapchain
      
      const swapChainDesc: GPUSwapChainDescriptor = {
        device: g.device,
        format: definitions.renderTexFormat,
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC 
      }
      
      // console.log(swapChainDesc)
      let swapchain: GPUSwapChain = g.context.configureSwapChain(swapChainDesc)

      // * Attachments

      const depthTextureDesc: GPUTextureDescriptor = {
        size: {
          width: g.canvas.width,
          height: g.canvas.height,
          depth: 1
        },
        // arrayLayerCount: 1, 
        // mipLevelCount: 1,
        // sampleCount: 1,
        // dimension: '2d',
        format: 'depth24plus-stencil8',
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
      };
      
      const depthTexture: GPUTexture = g.device.createTexture(depthTextureDesc);
      const colorTexture: GPUTexture  = swapchain.getCurrentTexture();




      // * Buffer 

      const vertexBuffer: GPUBuffer = g.createBuffer({
        bufferDataArray: new Float32Array([
          -1, -1, 0,           0, 0,
          1, -1, 0,            1, 0,
          -1, 1, 0,            0, 1,
          1, -1, 0,            1, 0,
          1, 1, 0,             1, 1,
          -1, 1, 0,            0, 1,
        ]),
        bufferUsage: GPUBufferUsage.VERTEX,
      })
      
      const uniformBuffer: GPUBuffer = g.createBuffer({
        bufferDataArray: new Float32Array([
          time,1,2,3
        ]),
        bufferUsage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })

      // * Textures

      for(let i = 0; i < gpuTextures.current.length; i++){
        const url = projects[currentProject.name].textures[i].name
        const tex: GPUTexture = await g.createTextureFromLink("./src/textures/" + url)
        gpuTextures.current[i] = tex
        if (tex){
          // alert("yay, loaded texture")
        }
        // const tex: GPUTexture = await g.createTextureFromLink("./src/textures/ShadertoyA.jpg")
      }
      
      // * Bind group
      const uniformBindGroupLayout = g.device.createBindGroupLayout({
        // @ts-ignore
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            type: "uniform-buffer"
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampler"
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 5,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 6,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 7,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 8,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
          {
            binding: 9,
            visibility: GPUShaderStage.FRAGMENT,
            type: "sampled-texture"
          },
        ]
      })
      const bindGroup = g.device.createBindGroup({
        layout: uniformBindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: {
              buffer: uniformBuffer
            }
          },
          {
            binding: 1,
            resource: g.device.createSampler({
              magFilter: 'linear',
              minFilter: 'linear',
            })
          },
          {
            binding: 2,
            resource: gpuTextures.current[0].createView()
          },
          {
            binding: 3,
            resource: gpuTextures.current[1].createView()
          },
          {
            binding: 4,
            resource: gpuTextures.current[2].createView()
          },
          {
            binding: 5,
            resource: gpuTextures.current[3].createView()
          },
          {
            binding: 6,
            resource: gpuTextures.current[4].createView()
          },
          {
            binding: 7,
            resource: gpuTextures.current[5].createView()
          },
          {
            binding: 8,
            resource: gpuTextures.current[6].createView()
          },
          {
            binding: 9,
            resource: gpuTextures.current[7].createView()
          },
        
        ]
      })
      

      const pipelineLayout: GPUPipelineLayout = g.device.createPipelineLayout({bindGroupLayouts: [uniformBindGroupLayout]})
      
      // * Render pipeline

      const vertexState: GPUVertexStateDescriptor = {
        // @ts-ignore
          vertexBuffers: [
            {
              arrayStride: 4*(3 + 2),  // sizeof(float) * 3
              attributes: [
                {
                  shaderLocation: 0,
                  offset: 0,
                  format: 'float3'
                },
                {
                  shaderLocation: 1,
                  offset: 3*4,
                  format: 'float2'
                },
              ],
              stepMode: 'vertex',
            }
          ],

      }
      renderPipelineDescriptor.current = {
        layout: pipelineLayout,
        vertexStage:{
          module: g.device.createShaderModule({ code: require('../shaders/vertQuad.js').default}),
          entryPoint: 'main',
        },
        fragmentStage:{
          module: g.device.createShaderModule({ code: require('../shaders/fragSt.js').default}),
          entryPoint: 'main',
        },
        primitiveTopology: "triangle-list",

        vertexState: vertexState,
        depthStencilState: {
          depthWriteEnabled: false,
          depthCompare: 'less',
          format: 'depth24plus-stencil8',
        },
        rasterizationState: {
          frontFace: 'cw',
          cullMode: 'none'
        },
        colorStates: [
          {
            format: definitions.renderTexFormat,
          },
        ],
      }

      await reloadShaders()
      console.log(renderPipeline.current)


      renderPipeline.current = g.device.createRenderPipeline(renderPipelineDescriptor.current)
      
      
      // * Render Pass Descriptor  
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [{
          attachment: undefined, // added later
          loadValue: { r: 0.3, g: 0.0, b: 0.0, a: 1.0 }
        }],
        depthStencilAttachment: {
          attachment: depthTexture.createView(),
          depthLoadValue: 1,
          depthStoreOp: 'store',
          stencilLoadValue: 0,
          stencilStoreOp: 'store',
        }
      }

      // !      
      // ! RENDERING ! // 
      // !      
      gpu.current = g

      

      console.log("after img loaded")
      const render = ( currTime: number) => {
        const newTimebufferDataArray : Float32Array = new Float32Array([
          time,0,0,0
        ]);
        g.device.defaultQueue.writeBuffer(
          uniformBuffer,
          0,
          newTimebufferDataArray.buffer,
          newTimebufferDataArray.byteOffset,
          newTimebufferDataArray.byteLength
            )

        const deltaTime = currTime -previousTime.current 
        if(!paused){
          setTime((time:number)=>{return time+deltaTime})
          
        }
        previousTime.current = currTime
        
        renderPassDescriptor.colorAttachments[0].attachment = swapchain.getCurrentTexture().createView()
        
        const commandEncoder: GPUCommandEncoder = gpu.current.device.createCommandEncoder()
        
        const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
      
        passEncoder.setPipeline(renderPipeline.current)
        passEncoder.setBindGroup(0, bindGroup)
        passEncoder.setVertexBuffer(0, vertexBuffer)
        passEncoder.draw(6, 1, 0, 0) // cnt, instancecnt
        passEncoder.endPass()

        gpu.current.device.defaultQueue.submit([commandEncoder.finish()])

        window.requestAnimationFrame(render)
      }
      
      window.requestAnimationFrame(render)
    } )()
  },[ projects[currentProject.name], shouldReloadTextures])
  // }, []);

  

  useEffect(() => {
     ( async ()=>{
       reloadShaders()
     }
    )()

  }, [shouldReloadShaderSwitch]);
  return (
    <>
      <canvas id="renderer" ref={canvasRef} {...canvasProps}></canvas>
      <CompilationSuccessIndicator compilationSuccess={compilationSuccess}/>
    </>
    
  )
}
const CompilationSuccessIndicator = (props)=>{

  return <div id="compilation-success-indicator" className={props.compilationSuccess ? "complation-success" : "complation-failure"}>


  </div>
}