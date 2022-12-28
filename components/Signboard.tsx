import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setImageRendered, setSignboard, setSignboardSvg, setTextRendered } from "../reducers/signboardSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const fabric = require("fabric").fabric;


const Signboard: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor()
  
  const dispatch = useDispatch()

  //canvas.setActiveObject(rect);
  const init = (canvas: any) => {
    setSize(canvas, signBoard.width, signBoard.height)
    setBackgroundColor(canvas, signBoard.backgroundColor)
    onReady(canvas)
  } 

  const setSize = (canvas:any, width:number, height:number) =>{
    canvas.setWidth(width)
    canvas.setHeight(height)
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
    console.log("Adding :", t)
    canvas.add(t)
  }

  const addImage = (canvas:any, imageSource:string) => {
      var imgElement = document.createElement('img');
      imgElement.src = imageSource
      var imgInstance = new fabric.Image(imgElement, {
        left: 0,
        top: 0,
        angle: 0,
        opacity: 1,
        width:200,
        height:200
      });
      canvas.add(imgInstance);
      
      };
      

      const signBoard = useSelector(selectSignboard)
      

      useEffect(() => {
        let canvas = editor?.canvas
        console.log(signBoard.texts)
        if(canvas){
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
              addImage(canvas, i.src)
              dispatch(setImageRendered({index})) 
            }
            index += 1
          }
     
          setSize(canvas, signBoard.width, signBoard.height)
          setBackgroundColor(canvas, signBoard.color)
        }
      },[signBoard])
  


      const dispatchSvg = () =>{
        let svg = editor?.canvas.toSVG()
        dispatch(setSignboardSvg({svg}))
      }

  return (
      <div className="relative p-2">
        {!signBoard.saved && 
        <div onClick={dispatchSvg} className="bg-green-500 rounded-full absolute right-0 bottom-0 z-50 hover:scale-110 ease-in-out duration-300">
          <FontAwesomeIcon className="w-8 h-8 p-1" icon={faCheck} color="#fff"/>
        </div>
        }
      <FabricJSCanvas className="sample-canvas overflow-hidden border-4 border-black rounded-md bg-white" onReady={init} />
      </div>
  );
};

export default Signboard;