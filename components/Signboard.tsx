import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setSignboard, setSignboardSvg } from "../reducers/signboardSlice";
const fabric = require("fabric").fabric;


const Signboard: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor()
  const signBoard = useSelector(selectSignboard)
  const dispatch = useDispatch()

  //canvas.setActiveObject(rect);
  const init = (canvas: any) => {
    setSize(canvas, signBoard.width, signBoard.height)
    setBackgroundColor(canvas, signBoard.backgroundColor)
    addText(canvas, signBoard.text)
    
    onReady(canvas)
  } 

  const setSize = (canvas:any, width:number, height:number) =>{
    canvas.setWidth(width)
    canvas.setHeight(height)
  }
  const setBackgroundColor = (canvas:any, color:string) =>{
    console.log("sbg")
    canvas.setBackgroundColor(color)
  }

  const addText = (canvas:any, text: {string:string, font:string, fontSize:number, color:string}) => {
      var t = new fabric.Text(text.string, {
            fill: text.color,
            fontFamily: text.font,
            fontSize: text.fontSize,
            top: canvas.height/2 - text.fontSize/2,  
        });

    t.left = canvas.width/2 - t.width/2
    
    canvas.add(t)
  }


      useEffect(() => {
       
        

        let svg = editor?.canvas.toSVG()
        dispatch(setSignboardSvg({svg}))
        
      },[editor, dispatch])

      useEffect(() => {
      
        let canvas = editor?.canvas
        if(canvas){
          setSize(canvas, signBoard.width, signBoard.height)
          setBackgroundColor(canvas, signBoard.color)
          console.log(canvas)
          let svg = editor?.canvas.toSVG()
          dispatch(setSignboardSvg({svg}))
        }
       
        

        
        
      },[signBoard, dispatch])
  
 

  return (

      <FabricJSCanvas className="sample-canvas border-2 border-black rounded-md bg-white" onReady={init} />

  );
};

export default Signboard;