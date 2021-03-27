import * as React from "react";
import  { useState, useEffect, useRef } from 'react';

import {definitions} from '../includes/definitions' 
import {WrGPU} from '../includes/WrGPU'
import ShaderContext from '../includes/context'

import { Project } from "../includes/interfaces";


type PickerParams = {
  currentProject: Project,
  setCurrentProject: Function,
  setProjects: Function,
  setCode: Function,
  code: string,
  projects: Object,
}

const defaultProjectName = "test"
export default function ProjectPicker ({currentProject, setCurrentProject, setCode, code, projects, setProjects}: PickerParams){
  const firstLoad = useRef<boolean>(true);

  useEffect(() => {
    
    let projectName:string = new URLSearchParams(window.location.search).get('projectName')
    if (!projectName)
      projectName = defaultProjectName
    
    loadProject(projectName)
  }, []);

  const loadProject: Function =  (projectName: string) => {
    
    // save curr shader code
    if(!firstLoad.current){
      projects[currentProject.name].code = code;
      setProjects(projects) 
    }
    firstLoad.current = false;

    // setSelected(projectName)

    const project = projects[projectName]
    console.log("project:   ", project)
    if(!project){
      alert("Error reading projects file.")
    }
    setCurrentProject({
      name: projectName,
      code: project.code,
      textures: project.textures
    })
    setCode(project.code)

  }
  
  // const [selected, setSelected] = useState("")

  return (
    <>
    <select value={currentProject.name} onChange={e=>{
      loadProject(e.target.value)
    }}>
      {
        Object.keys(projects).map((key, idx)=>
          <option value={key}>{key}</option>
        )
      }
    </select>
    </>
  )
}
