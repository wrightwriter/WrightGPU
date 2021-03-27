import * as React from "react";
import  { useState, useEffect, useRef } from 'react';

import {definitions} from '../includes/definitions' 
import {WrGPU} from '../includes/WrGPU'
import ShaderContext from '../includes/context'
import fileDialog from 'file-dialog'
import {Project, Texture} from '../includes/interfaces' 


type TexturePickerProps = {
  currentProject: Project,
  projects: Object,
  setProjects: Function,
  shouldReloadTextures: any  // react ref
}

export default function TexturePicker ({currentProject, projects,setProjects, shouldReloadTextures}:TexturePickerProps){
  useEffect(() => {
  }, []);
  const [selected, setSelected] = useState<string>("")
  const selectedId = useRef<number>(0)
  const filePicker = useRef(null);

  const pickFile: Function = async (e) => {
    console.log(e)
    const file = e.target.files[0];
    const textureName = e.target.files[0].name;
    // alert(textureName)
    
    console.log(projects)
    // TODO WHOLE TEXTURE

    projects[currentProject.name].textures[selectedId.current].name = textureName
    setProjects(projects)

    shouldReloadTextures.current = !shouldReloadTextures.current

    // const reader = new FileReader();
    // reader.onload = (event) =>{
    //   alert("aaa")
    //   console.log(event)
    // };
    // reader.readAsDataURL(file)
    // console.log(e)

  }
  useEffect(()=>{

  },[currentProject])

  return <div className="texture-picker">
            <TextureNode filePicker={filePicker} nodeId={0} selectedId={selectedId} textures={currentProject.textures}/>
            <TextureNode filePicker={filePicker} nodeId={1} selectedId={selectedId} textures={currentProject.textures}/>
            <TextureNode filePicker={filePicker} nodeId={2} selectedId={selectedId} textures={currentProject.textures}/>
            <TextureNode filePicker={filePicker} nodeId={3} selectedId={selectedId} textures={currentProject.textures}/>
            <input type='file' id='file' 
              ref={filePicker} 
              onChange={ e => pickFile(e) }
              style={{display: 'none'}
            }/>
  </div>
}



type TextureNodeInputs = {
  filePicker: React.MutableRefObject<any>,
  selectedId: React.MutableRefObject<number>,
  nodeId: number,
  // textures: Array<Texture>,
  textures: any,
}
const TextureNode: Function = ({filePicker, nodeId, selectedId, textures}:TextureNodeInputs)=>{
  
  const currTexture = textures[nodeId]

  const divStyle = {
    backgroundImage:(currTexture === undefined || !currTexture.name )? `red` : `url("./src/textures/${currTexture.name}")` 
  }
  
  return <div
    className="texture-picker-node"
    style={ divStyle }
    onClick={()=>{
      selectedId.current = nodeId
      filePicker.current.click()
    }}>
    </div>
}