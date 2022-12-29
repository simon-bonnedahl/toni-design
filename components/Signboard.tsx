import React, { useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setImageRendered, setSignboardPixelData, setSignboardSaved, setSignboardSvg, setTextRendered } from "../reducers/signboardSlice";
import { sign } from "crypto";
const fabric = require("fabric").fabric;


const Signboard: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor()
  const signBoard = useSelector(selectSignboard)
  const [currentShape, setCurrentShape] = useState("")
  const [currentSize, setCurrentSize] = useState({width: 0, height: 0})
  const [currentColor, setCurrentColor] = useState("#ffffff")
  const [lastSave, setLastSave] = useState(new Date().getTime())

  var last = new Date().getTime()
  
  const dispatch = useDispatch()

  //canvas.setActiveObject(rect);
  const init = (canvas: any) => {
    setSize(canvas, signBoard.width, signBoard.height)
    setBackgroundColor(canvas, signBoard.backgroundColor)
    onReady(canvas)
  } 

  const setSize = (canvas:any, width:number, height:number) =>{
    //convert to pixels from mm
    let c = 2.8346546
    let z = canvas.getZoom()
    setCurrentSize({width, height})
    canvas.setWidth(width*c*z)
    canvas.setHeight(height*c*z)
    //Update shape size
    setShape(canvas, currentShape)
  }

  const setShape = (canvas:any, shape:string) =>{
    let s = null
    let borderWidth = 2
    let borderColor = "#000"
    

    switch(shape){
      case "Rectangle":
         s = new fabric.Rect({
        width: canvas.width - borderWidth,
        height: canvas.height - borderWidth,
        fill: signBoard.color,
        stroke: borderColor,
        strokeWidth: borderWidth,
      }) 
        break;
      case "Rounded Rectangle":
        s = new fabric.Rect({
        width: canvas.width - borderWidth,
        height: canvas.height - borderWidth,
        fill: signBoard.color,
        stroke: borderColor,
        strokeWidth: borderWidth,
        rx: 20,
        ry: 20,
      }) 
        break;
      case "Ellipse":
         s = new fabric.Ellipse({
            rx: canvas.width/2 - borderWidth,
            ry: canvas.height/2 - borderWidth,
            fill: signBoard.color,
            stroke: borderColor,
            strokeWidth: borderWidth,    
        }); 
        break
      default:
        return
    }
    //Lock the shapeobject
    s.hasControls = false;
    s.hasBorders = false;
    s.lockMovementX = true;
    s.lockMovementY = true;
    s.selectable = false,
    s.evented = false,

    //Replace the frame, this works if the frame always is the first object, which it should
    canvas._objects[0] = s
    canvas.renderAll();
    setCurrentShape(shape)
  }

  const setBackgroundColor = (canvas:any, color:string) =>{
    setCurrentColor(color)
    setShape(canvas, currentShape)
  }

  const addText = (canvas:any, text: {string:string, font:string, fontSize:number, color:string , rendered:boolean}) => {
      var t = new fabric.Text(text.string, {
            fill: text.color,
            fontFamily: text.font,
            fontSize: text.fontSize,
            top: canvas.height/2 - text.fontSize/2,  
        });

    t.left = canvas.width/2 - t.width/2
    canvas.add(t)
    canvas.setActiveObject(t)
    canvas.renderAll()
  }

  const addImage = (canvas:any, imageUrl:string, imageType:string) => {
    if(imageType === "image/svg+xml"){
      var group: any[] = [];

        fabric.loadSVGFromURL(imageUrl, function(objects: any, options: any) {

            var loadedObjects = new fabric.Group(group);

            loadedObjects.set({
                    left: 0,
                    top: 0,
                    width:50,     //Need to be calculated
                    height:50
            });

            canvas.add(loadedObjects);

        },function(item: { getAttribute: (arg0: string) => any; }, object: { set: (arg0: string, arg1: any) => void; }) {
                object.set('id',item.getAttribute('id'));
                group.push(object);
        });
    }else{
      let imgElement = document.createElement('img');
      imgElement.src = imageUrl
      //Create the image to gain the width and height
      let img = new Image()
      img.onload = function () {
        var imgInstance = new fabric.Image(imgElement, {
        left: 0,
        top: 0,
        angle: 0,
        opacity: 1,
        width: img.width * signBoard.zoom, //Math.min(img.width, signBoard.width), //To not overflow the canvas, this need to scale the image instead of cropping
        height: img.height * signBoard.zoom,  // Math.min(img.height, signBoard.height),
      });
      canvas.add(imgInstance);
      canvas.setActiveObject(imgInstance)
      canvas.renderAll()
      };
      img.src = imageUrl
    }
    
      };
      

      const keyHandler = useCallback((event: { key: string; }) => {
        let targetObject = editor?.canvas.getActiveObject()
        if (event.key === "Backspace") {   
          editor?.canvas.remove(targetObject)
        }else{    //If we press any other key, like typing text, we de-select the target object so it wont be deleted
          if(targetObject)
            editor?.canvas.discardActiveObject()
            
        }
        //Ctrl-Z ?
      }, [editor?.canvas]);
      

    
      editor?.canvas.on({
      'object:modified': function(e: any) {
        //editor?.canvas.setActiveObject(null)
        saveSignboard()    
      },
      'object:selected': function (e: any) {
      console.log('selected: ', e.target);
      },
  });
      

      useEffect(() => {
        let canvas = editor?.canvas

        if(canvas){
          if(signBoard.shape != currentShape){   
            setShape(canvas, signBoard.shape)
          }
          if(signBoard.width != currentSize.width || signBoard.height != currentSize.height){
            setSize(canvas, signBoard.width, signBoard.height)
          }
          if(signBoard.color != currentColor){
            setBackgroundColor(canvas, signBoard.color)
          }
          canvas.setZoom(signBoard.zoom)

          {/* Render new objects */}
          let index = 0
          for(let t of signBoard.texts){
            if(!t.rendered){
              addText(canvas, t)
              dispatch(setTextRendered({index}))   
            }
            index += 1
          }

          index = 0
          for(let i of signBoard.images){      
            if(!i.rendered){
              addImage(canvas, i.url, i.type)
              dispatch(setImageRendered({index})) 
            }
            index += 1
          }
          //Add key listener
          document.addEventListener("keydown", keyHandler, false);
        }
        if(!signBoard.saved){
          saveSignboard()
        }
        
        
      },[signBoard, editor?.canvas])
  


      const saveSignboard = () =>{
        //Need timeout on saveSignboard since its heavy
        //Need to dispatch saveState?
        let timeout = 3000 // 3 seconds
        let now = new Date().getTime()
        if((now - last) > timeout){
          last = now
          console.log("save")
          let svg = editor?.canvas.toSVG()
          dispatch(setSignboardSvg({svg}))
          var pixelData = editor?.canvas.toDataURL("image/jpeg", 1.0);
          dispatch(setSignboardPixelData({pixelData}))
          dispatch(setSignboardSaved({saved:true}))
          
        }
      }

  return (
      <div className="border border-gray">
      <FabricJSCanvas className="sample-canvas" onReady={init} />
      </div>
  );
};

export default Signboard;