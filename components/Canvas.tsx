import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectSignboard } from "../reducers/signboardSlice";
import Signboard from "./Signboard";



const Canvas: React.FC = () => {

  const signBoard = useSelector(selectSignboard)
  useEffect(() => {

  }, [signBoard])

 
  return (
   
    <div className="flex flex-1 bg-white justify-center items-center">
        <Signboard width={signBoard.width} height={signBoard.height} color={signBoard.color} text={signBoard.text}/>
    </div>
  );
};

export default Canvas;