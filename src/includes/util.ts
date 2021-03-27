import jsonBeautify from "json-beautify"


export function downloadObjectAsJson(exportObj: Object, exportName: string){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonBeautify(exportObj,null,2,100));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}