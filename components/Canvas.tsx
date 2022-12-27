import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectSignboard } from "../reducers/signBoardSlice";
import Signboard from "./Signboard";



const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const signBoard = useSelector(selectSignboard)
  useEffect(() => {

  }, [signBoard])

 
  return (
   
    <div className="flex flex-1 bg-white justify-center items-center">
        Canvas
        <Signboard width={signBoard.width} height={signBoard.height} color={signBoard.background}/>
    </div>
  );
};

export default Canvas;