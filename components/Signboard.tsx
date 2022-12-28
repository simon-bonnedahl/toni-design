import React, { useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { selectSignboard, setImageRendered, setSignboardPixelData, setSignboardSvg, setTextRendered } from "../reducers/signboardSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const fabric = require("fabric").fabric;


const Signboard: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor()
  const signBoard = useSelector(selectSignboard)
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
    canvas.setWidth(width*c)
    canvas.setHeight(height*c)
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
  }

  const addImage = (canvas:any, imageUrl:string, imageType:string) => {
    if(imageType === "image/svg+xml"){
      var group: any[] = [];

        fabric.loadSVGFromURL(imageUrl, function(objects: any, options: any) {

            var loadedObjects = new fabric.Group(group);

            loadedObjects.set({
                    left: 0,
                    top: 0,
                    width:50,
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
        width: Math.min(img.width, signBoard.width), //To not overflow the canvas, this need to scale the image instead of cropping
        height: Math.min(img.height, signBoard.height),
      });
      canvas.add(imgInstance);
      canvas.setActiveObject(imgInstance)
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
      }, [editor?.canvas]);
        
      

      useEffect(() => {
        let canvas = editor?.canvas
        
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
              addImage(canvas, i.url, i.type)
              dispatch(setImageRendered({index})) 
            }
            index += 1
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
      <div className="relative p-2">
        {!signBoard.saved && 
        <div onClick={saveSignboard} className="bg-green-500 rounded-full absolute right-0 bottom-0 z-50 hover:scale-110 ease-in-out duration-300">
          <FontAwesomeIcon className="w-8 h-8 p-1" icon={faCheck} color="#fff"/>
        </div>
        }
      <FabricJSCanvas className="sample-canvas overflow-hidden border-4 border-black rounded-md bg-white" onReady={init} />
      </div>
  );
};

export default Signboard;