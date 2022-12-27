import React, { useRef } from "react";
import { useDispatch } from "react-redux";

interface SignboardProps {
  width: number;
  height: number;
  color: string;
  text: {string: string, font: string, fontSize: number, color: string};
}

const Signboard: React.FC<SignboardProps> = ({ width, height, color, text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch()
  // Draw the background
  const context = canvasRef.current?.getContext('2d')
  if(context){
     context.fillStyle = color
     context.fillRect(0, 0, width, height)
     console.log(text.string)
     context.fillStyle = text.color
     context.font = `${text.fontSize}px sans-serif`
     context.fillText(text.string, 0, 0 + text.fontSize)
  }
  
 
  
 

  return (
   
     <canvas id="canvas" className="border-2 border-black rounded-md bg-white" ref={canvasRef} width={width} height={height} />
  );
};

export default Signboard;