import {
  faRotateBack,
  faRotateForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import { getSignVisual } from "../reducers/signSlice";
import Colordropdown from "./dropdowns/Colordropdown";
import Imagedropdown from "./dropdowns/Imagedropdown";
import Shapedropdown from "./dropdowns/Shapedropdown";
import Sizedropdown from "./dropdowns/Sizedropdown";
import Textdropdown from "./dropdowns/Textdrowdown";

const Topbar: React.FC = () => {
  const sign = useSelector(getSignVisual);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row justify-between w-screen shadow-lg bg-base-200">
      <div className="flex items-center h-full pl-4 space-x-5">
        <button
          onClick={() =>
            dispatch(addCommand({ command: "reset", value: null }))
          }
          className="btn btn-primary btn-outline ml-10"
        >
          Börja om
        </button>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goBack", value: null }))
          }
        >
          <FontAwesomeIcon
            className="text-primary scale-125 hover:scale-150 ease-in-out duration-300 hover:cursor-pointer"
            icon={faRotateBack}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goForward", value: null }))
          }
        >
          <FontAwesomeIcon
            className="text-primary scale-125 hover:scale-150 ease-in-out duration-300 hover:cursor-pointer"
            icon={faRotateForward}
          />
        </div>
      </div>
      {/*Dropdowns*/}
      <div className="flex space-x-2">
        <Sizedropdown />
        <Colordropdown />
        <Shapedropdown />
        <Textdropdown />
        <Imagedropdown />
      </div>
      {/*Size*/}
      <div className="flex space-x-4 items-center h-full mr-10">
        <div>
          Bredd: <span className="font-bold">{sign.width}</span> mm
        </div>
        <div>
          Höjd: <span className="font-bold">{sign.height}</span> mm
        </div>
        <div>
          Djup: <span className="font-bold">1</span> mm
        </div>
      </div>
    </div>
  );
};

export default Topbar;
