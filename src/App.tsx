
import * as React from "react";
import  { useState, useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import Renderer from './components/Renderer';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Timer from 'react-compound-timer'
// import './styles/style.scss'
import './styles/style.scss'
const projectsJSON = require("./Projects/projects.json")



import { Project } from "./includes/interfaces";
import TexturePicker from "./components/TexturePicker";
import ProjectPicker from './components/ProjectPicker';
import ShaderSaver from './components/ShaderSaver';



export function App () {
   
  const [code, setCode] = useState<string>("")
  const [projects, setProjects] = useState<Object>(projectsJSON)
  const [currentProject, setCurrentProject] = useState<Project>(projectsJSON[Object.keys(projectsJSON)[0]])
  const [shouldReloadShaderSwitch, setshouldReloadShaderSwitch] = useState(false)
  const shouldReloadTextures = useRef<boolean>(true)
  const options = {
    selectOnLineNumbers: true
  };


  const [time, setTime] = useState<number>(0)
  let timeTicker: NodeJS.Timeout;
  const [paused, setPaused] = useState<boolean>(false)

  useEffect(()=>{
    setTime(0)
  },[])
  
  const onChange = (newValue, e)=>{
    setCode(newValue)
  }

  const keyCombinations = ['alt+enter', "ctrl+alt+up", "ctrl+alt+down", "ctrl+alt+left", "ctrl+alt+right", "alt+enter", ]
  const handleKeys = (key ,e ) => {
    switch(key){
      case("alt+enter"): {
        setshouldReloadShaderSwitch(!shouldReloadShaderSwitch)
      }
      case("ctrl+alt+p"):{
        // alert(paused)
        setPaused(!paused)
      }
      case("ctrl+alt+down"):{
        setTime(0)
      }
      case("ctrl+alt+left"):{
        setPaused(true)
        setTime(Math.max(time - 0.01,0))
      }
      case("ctrl+alt+right"):{
        setPaused(true)
        setTime(time + 0.01);
      }
    }
  }
  const editorDidMount = (editor, monaco)=>{
    console.log('editorDidMount', editor);
    editor.focus()
  }
  
  return (
    <div id="container" >
        <h1 id="logo">
          WrighterToy
        </h1>
        <Renderer 
          shouldReloadShaderSwitch={shouldReloadShaderSwitch}
          shouldReloadTextures={shouldReloadTextures.current}
          shaderCode={code}
          time={time}
          currentProject={currentProject} 
          projects={projects} 
          setTime={(t:number)=>{setTime(t)}}
          paused={paused}
        /> {time/1000}
        <KeyboardEventHandler
        handleKeys={keyCombinations}
        onKeyEvent={(key, e) => { handleKeys(key, e) }} >
          <div id="bottom">
              <MonacoEditor
                width="900"  
                height="600"
                language="cpp"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={(newValue, e)=>(onChange(newValue, e))}
                editorDidMount={(editor, monaco)=>(editorDidMount(editor, monaco))}
                />
            <div id="control-panel">
              <ProjectPicker 
                projects={projects} 
                setProjects={(p)=>setProjects(p)} 
                currentProject={currentProject} 
                setCurrentProject={setCurrentProject} 
                code={code}
                setCode={(code: string)=>{setCode(code); setshouldReloadShaderSwitch(!shouldReloadShaderSwitch)}}
                />
              <ShaderSaver
                projects={projects} 
                currentProject={currentProject} 
                code={code}
                />
              <TexturePicker
                currentProject={currentProject}
                projects={projects}
                setProjects={setProjects}
                shouldReloadTextures={shouldReloadTextures}
              />
            </div>


          </div>
        </KeyboardEventHandler>
    </div>

  )
};
