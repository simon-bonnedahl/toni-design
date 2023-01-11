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
import Productdropdown from "./dropdowns/Productdropdown";
import Shapedropdown from "./dropdowns/Shapedropdown";
import Sizedropdown from "./dropdowns/Sizedropdown";
import Textdropdown from "./dropdowns/Textdrowdown";

const Topbar: React.FC = () => {
  const sign = useSelector(getSignVisual);
  const dispatch = useDispatch();

  const openSizeDropdown = () => {
    document.getElementById("size-dropdown")?.focus();
  };

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
          className=" hover:scale-125 ease-in-out duration-300 hover:cursor-pointer"
        >
          <FontAwesomeIcon
            className="text-primary scale-150"
            icon={faRotateBack}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goForward", value: null }))
          }
          className=" hover:scale-125 ease-in-out duration-300 hover:cursor-pointer"
        >
          <FontAwesomeIcon
            className="text-primary scale-150"
            icon={faRotateForward}
          />
        </div>
      </div>
      {/*Dropdowns*/}
      <div className="flex space-x-2">
        <Productdropdown />
        <Sizedropdown />
        <Colordropdown />
        <Shapedropdown />
        <Textdropdown />
        <Imagedropdown />
      </div>
      {/*Size*/}
      <div
        onClick={openSizeDropdown}
        className="flex space-x-4 items-center h-full mr-4 font-light text-sm hover:cursor-pointer"
      >
        <div>
          <span className="font-bold">Bredd:</span> {sign.width} mm
        </div>
        <div>
          <span className="font-bold"> Höjd:</span> {sign.height} mm
        </div>
        <div>
          <span className="font-bold">Djup:</span> 1 mm
        </div>
      </div>
    </div>
  );
};

export default Topbar;
