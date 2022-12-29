import React, { useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setDownloadPdf, setDownloadSvg, setImageRendered, setSignboardPixelData, setSignboardSvg, setTextRendered } from "../reducers/signboardSlice";
const fabric = require("fabric").fabric;
const { jsPDF } = require("jspdf")


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
    let w = width * c * z
    let h = height * c * z
    let bw = 2 //border width


    //Update shape size and position
    let shape = canvas._objects[0]
    if(shape){
      if(signBoard.shape === "Ellipse"){
        shape.set({rx: w/2 - bw, ry: h/2 - bw})
      }else{
        shape.set({width: w-bw, height: h-bw})
      }
      alignObject("center", shape)
    }
      setCurrentSize({width:w, height:h})
  }

  const setShape = (canvas:any, shape:string) =>{
    let s = null
    let borderWidth = 1
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

    s.shadow = new fabric.Shadow({ 
            color: "#333", 
            blur: 30,
            offsetY: 5
        })

    //Replace the frame, this works if the frame always is the first object, which it should
    canvas._objects[0] = s
    canvas.renderAll();
    setCurrentShape(shape)
  }

  const setBackgroundColor = (canvas:any, color:string) =>{
    let shape = canvas._objects[0]
    if(shape)
      shape.set({fill: color})
      setCurrentColor(color)
  }

  const addText = (canvas:any, text: {string:string, font:string, fontSize:number, color:string , rendered:boolean}) => {
      var t = new fabric.Text(text.string, {
            fill: text.color,
            fontFamily: text.font,
            fontSize: text.fontSize,
        }); 
    canvas.add(t)
    alignObject('center', t)  
    canvas.setActiveObject(t)
    canvas.renderAll()
  }

  const addImage = (canvas:any, imageUrl:string, imageType:string) => {
    if(imageType === "image/svg+xml"){
      var group: any[] = [];

        fabric.loadSVGFromURL(imageUrl, function(objects: any, options: any) {

            var svg = new fabric.Group(group);

            svg.set({
                    width:50,     //Need to be calculated
                    height:50
            });
            alignObject("center", svg)
            canvas.add(svg);

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
        var i = new fabric.Image(imgElement, {
        angle: 0,
        opacity: 1,
        width: img.width * signBoard.zoom, //Math.min(img.width, signBoard.width), //To not overflow the canvas, this need to scale the image instead of cropping
        height: img.height * signBoard.zoom,  // Math.min(img.height, signBoard.height),
      });

      canvas.add(i);
      alignObject('center', i)   
      canvas.setActiveObject(i)
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
      

     
  const alignObject = (location:string, obj:any) => {

      //activeObj.getBoundingRect()
      //https://stackoverflow.com/questions/47408816/object-alignment-in-fabric-js
    switch (location) {

    case 'left':
      obj.set({
        left: 0
      });
      break;
    case 'right':
      obj.set({
        left: canvas.width - (obj.width * obj.scaleX)
      });
      break;
    case 'top':
      obj.set({
        top: 0
      });
      break;
    case 'bottom':
      obj.set({
        top: canvas.height - (obj.height * obj.scaleY)
      });
      break;
    case 'top-center':
      obj.set({
        left: (canvas.width / 2) - ((obj.width * obj.scaleX) / 2)
      });
      break;
    case 'center':
      obj.set({
        left: (canvas.width / 2) - ((obj.width * obj.scaleX) / 2),
        top: (canvas.height / 2) - ((obj.height * obj.scaleY) / 2)
      });
      break;
  }
}
 let canvas = editor?.canvas
 if(canvas){
canvas.on('mouse:move', function(e:any) {
  if (canvas.isDragging) {
    var vpt = canvas.viewportTransform;
    vpt[4] += e.clientX - canvas.lastPosX;
    vpt[5] += e.clientY - canvas.lastPosY;
    canvas.requestRenderAll();
    canvas.lastPosX = e.clientX;
    canvas.lastPosY = e.clientY;
  }
});
canvas.on('mouse:up', function(opt: any) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.isDragging = false;
  canvas.selection = true;
});

canvas.on({
      'object:modified': function(e: any) {
        //editor?.canvas.setActiveObject(null)  
      },
      'object:selected': function (e: any) {
      console.log('selected: ', e.target);
      },
      'mouse:down': function(e: any) {
      if (e.altKey === true) {
        console.log("HEEE")
        canvas.isDragging = true;
        canvas.selection = false;
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      }
    },

  });

 }
   

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

          if(signBoard.downloadPdf){
            handleDownloadPdf(canvas)
          }
          if(signBoard.downloadSvg){
            handleDownloadSvg(canvas)
          }
        }

      },[signBoard, editor?.canvas])
      


    const handleDownloadPdf = (canvas:any) => { 
        canvas._objects[0].set({shadow: null})
        let pdf = new jsPDF();
        let pixelData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(pixelData, 'JPEG', 0, 0); 
        pdf.save("download.pdf");
        dispatch(setDownloadPdf({downloadPdf:false}))
        setShape(canvas, currentShape)
      }
    
    const handleDownloadSvg = (canvas:any) => {
        //remove shadow, maybe shrink canvas and align the sign in there before saving?
  
        canvas._objects[0].set({shadow: null})
        let blob = new Blob([canvas.toSVG()], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;   
        a.download = "download.svg";
        a.click();
        dispatch(setDownloadSvg({downloadSvg:false}))
        setShape(canvas, currentShape)
      }

  return (
      <div className="border border-gray w-full h-full">
      <FabricJSCanvas className="sample-canvas w-full h-full bg-slate-200" onReady={init} />
      </div>
  );
};

export default Signboard;