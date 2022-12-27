import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { setSignboardPixelData } from "../reducers/signBoardSlice";

interface SignboardProps {
  width: number;
  height: number;
  color: string;
}

const Signboard: React.FC<SignboardProps> = ({ width, height, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch()
  // Draw the background
  const context = canvasRef.current?.getContext('2d')
  if(context){
     context.fillStyle = color
     context.fillRect(0, 0, width, height)
     const pixelData = context.getImageData(0, 0, width, height, {colorSpace: "srgb" }).data;
     //dispatch(setSignboardPixelData({pixelData}))
  }
  
 
  
 

  return (
   
     <canvas id="canvas" className="border-2 border-black rounded-md bg-white" ref={canvasRef} width={width} height={height} />
  );
};

export default Signboard;