
import * as React from "react";
import  { useState, useEffect, useRef } from 'react';

import { Project } from "../includes/interfaces";
import {downloadObjectAsJson} from "../includes/util"


type PickerParams = {
  currentProject: Project,
  code: string,
  projects: Object,
}

export default function ProjectSaver ({currentProject, code, projects}: PickerParams){
  const saveProject: Function = () => {
    // TODO: remove this current project shit
    let project = projects[currentProject.name]


    project.code = code;

    projects[currentProject.name] = project

    downloadObjectAsJson(projects, "projects")
    // console.log(project)
  }
  useEffect(() => {

  }, []);

  return (
    <button onClick={()=>saveProject()}>Save</button>
  )
}