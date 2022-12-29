import React, { useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setImageRendered, setSignboardPixelData, setSignboardSvg, setTextRendered } from "../reducers/signboardSlice";
const fabric = require("fabric").fabric;


const Signboard: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor()
  const signBoard = useSelector(selectSignboard)
  const [currentShape, setCurrentShape] = useState("")
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
    canvas.setWidth(width*c*z + 1)
    canvas.setHeight(height*c*z + 1)
  }
  const setShape = (canvas:any, shape:string) =>{

    //Remove the previous shape

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
    }
    //Lock the shapeobject
    s.hasControls = false;
    s.hasBorders = false;
    s.lockMovementX = true;
    s.lockMovementY = true;
    s.selectable = false,
    s.evented = false,
    canvas._objects[0] = s
    console.log(canvas)
    setCurrentShape(shape)
  }

  const setBackgroundColor = (canvas:any, color:string) =>{
    canvas.setBackgroundColor(color)
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
    saveSignboard()
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
      saveSignboard()
      };
      img.src = imageUrl
    }
    /*
    });*/
      };
      

      const keyHandler = useCallback((event: { key: string; }) => {
        let targetObject = editor?.canvas.getActiveObject()
        if (event.key === "Backspace") {   
          editor?.canvas.remove(targetObject)
        }
        //Ctrl-Z ?
      }, [editor?.canvas]);
        
      editor?.canvas.on({
      'object:moving': function(e: any) {
        e.target.opacity = 0.8;
      },
      'object:modified': function(e: any) {
        saveSignboard()
        e.target.opacity = 1;
      }
  });
      

      useEffect(() => {
        let canvas = editor?.canvas
        console.log(editor)

        if(canvas){
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

          canvas.setZoom(signBoard.zoom)
          if(signBoard.shape != currentShape){    //Apply this to below?
            setShape(canvas, signBoard.shape)
          }
          
          setSize(canvas, signBoard.width, signBoard.height)
          setBackgroundColor(canvas, signBoard.color)
          document.addEventListener("keydown", keyHandler, false);
        }
        
      },[signBoard, editor?.canvas])
  


      const saveSignboard = () =>{
        let svg = editor?.canvas.toSVG()
        dispatch(setSignboardSvg({svg}))
        var pixelData = editor?.canvas.toDataURL("image/jpeg", 1.0);
        dispatch(setSignboardPixelData({pixelData}))
        
      }

  return (
      <div className="border border-gray">
      <FabricJSCanvas className="sample-canvas p-4" onReady={init} />
      </div>
  );
};

export default Signboard;