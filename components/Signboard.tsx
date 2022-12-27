import React, { useRef } from "react";

interface SignboardProps {
  width: number;
  height: number;
}

const Signboard: React.FC<SignboardProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
   
     <canvas className="border-2 border-black rounded-md bg-white"ref={canvasRef} width={width} height={height} />
  );
};

export default Signboard;