import {
  faArrowsTurnRight,
  faArrowTurnUp,
  faRotateBack,
  faRotateForward,
  faTurnDown,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import { getSignVisual } from "../reducers/signSlice";
import Applicationdropdown from "./dropdowns/Applicationdropdown";
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
    <div className="flex flex-row justify-between items-center w-screen bg-base-200 h-16 ">
      <div className="flex items-center h-full pl-4">
        <div
          onClick={() =>
            dispatch(addCommand({ command: "reset", value: null }))
          }
          className="btn btn-ghost flex space-x-2"
        >
          <FontAwesomeIcon
            className="text-primary scale-150"
            icon={faRotateBack}
          />
          <span>Börja om</span>
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goBack", value: null }))
          }
          className="btn btn-ghost"
        >
          <FontAwesomeIcon
            className="text-primary scale-150 -rotate-90"
            icon={faTurnUp}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goForward", value: null }))
          }
          className=" btn btn-ghost"
        >
          <FontAwesomeIcon
            className="text-primary scale-150 -rotate-90"
            icon={faTurnDown}
          />
        </div>
      </div>
      {/*Dropdowns*/}
      <div className="flex space-x-2">
        <Productdropdown />
        <Applicationdropdown />
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
