import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import { getSignVisual } from "../reducers/signSlice";
import { setSelectedOption } from "../reducers/toolbarSlice";

const Topbar: React.FC = () => {
  const sign = useSelector(getSignVisual);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(addCommand({ command: "goBack", value: null }));
  };
  const handleGoForward = () => {
    dispatch(addCommand({ command: "goForward", value: null }));
  };

  return (
    <div className="flex flex-row justify-end  w-screen h-10 shadow-lg z-50">
      <div className="flex items-center h-full pl-4 space-x-2 w-fit ml-40">
        <div
          onClick={handleGoBack}
          className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
        >
          <FontAwesomeIcon className="w-6 h-6" icon={faBackward} />
        </div>
        <div
          onClick={handleGoForward}
          className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center  hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
        >
          <FontAwesomeIcon className="w-6 h-6" icon={faForward} />
        </div>
      </div>

      {/*Size*/}
      <div
        onClick={() => dispatch(setSelectedOption({ selectedOption: 2 }))}
        className="flex space-x-4 items-center h-full hover:cursor-pointer pr-6"
      >
        <div>
          Width: <span className="font-bold">{sign.width}</span> mm
        </div>
        <div>
          Height: <span className="font-bold">{sign.height}</span> mm
        </div>
      </div>
    </div>
  );
};

export default Topbar;
