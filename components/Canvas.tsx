import React, { useRef } from "react";
import Signboard from "./Signboard";



const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signBoardWidth = 600
  const signBoardHeight = 200
  return (
   
    <div className="flex flex-1 bg-white justify-center items-center">
        Canvas
        <Signboard width={signBoardWidth} height={signBoardHeight}/>
    </div>
  );
};

export default Canvas;