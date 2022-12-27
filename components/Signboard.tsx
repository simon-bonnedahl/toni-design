import React, { useRef } from "react";

interface SignboardProps {
  width: number;
  height: number;
  color: string;
}

const Signboard: React.FC<SignboardProps> = ({ width, height, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the background
  const ctx = canvasRef.current?.getContext('2d')
  if(ctx){
     ctx.fillStyle = color
     ctx.fillRect(0, 0, width, height)
  }
 

  return (
   
     <canvas className="border-2 border-black rounded-md bg-white"ref={canvasRef} width={width} height={height} />
  );
};

export default Signboard;