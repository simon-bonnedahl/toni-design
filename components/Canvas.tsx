import React from "react";
import Signboard from "./Signboard";

const Canvas: React.FC = () => {
  return (
    <div className="flex flex-1 bg-white justify-center items-center overflow-hidden">
        <Signboard/>
    </div>
  );
};

export default Canvas;