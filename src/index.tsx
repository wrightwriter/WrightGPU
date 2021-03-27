/// <reference path="../node_modules/@webgpu/types/dist/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import ShaderContext from './includes/context'
// @ts-ignore

ReactDOM.render(
  <ShaderContext.Provider
  value={ {
    lang: 'de',
    authenticated: true,
    theme: 'light'
  } } 
  >
    <App/>
  </ShaderContext.Provider>
  ,
  document.getElementById("react")
);
window.onload = async() =>{
}


// Buffer
// type
// components, stride, offs, type 
// vertex cnt