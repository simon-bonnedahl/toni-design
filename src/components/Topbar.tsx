import {
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotateBack,
  faTurnDown,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import { getSignVisual } from "../../reducers/signSlice";
import Applicationdropdown from "./Editor/dropdowns/Applicationdropdown";
import Colordropdown from "./Editor/dropdowns/Colordropdown";
import Imagedropdown from "./Editor/dropdowns/Imagedropdown";
import Productdropdown from "./Editor/dropdowns/Productdropdown";
import Shapedropdown from "./Editor/dropdowns/Shapedropdown";
import Sizedropdown from "./Editor/dropdowns/Sizedropdown";
import Textdropdown from "./Editor/dropdowns/Textdrowdown";

const Topbar: React.FC = () => {
  const sign = useSelector(getSignVisual);
  const dispatch = useDispatch();

  const openSizeDropdown = () => {
    document.getElementById("size-dropdown")?.focus();
  };

  return (
    <div className="flex h-16 w-screen flex-row items-center justify-between bg-base-200 ">
      <div className="flex h-full items-center pl-4">
        <div
          onClick={() =>
            dispatch(addCommand({ command: "reset", value: null }))
          }
          className="btn-ghost btn flex space-x-2"
        >
          <FontAwesomeIcon
            className="scale-150 text-primary"
            icon={faRotateBack}
          />
          <span>Börja om</span>
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goBack", value: null }))
          }
          className="btn-ghost btn"
        >
          <FontAwesomeIcon
            className="-rotate-90 scale-150 text-primary"
            icon={faTurnUp}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "goForward", value: null }))
          }
          className=" btn-ghost btn"
        >
          <FontAwesomeIcon
            className="-rotate-90 scale-150 text-primary"
            icon={faTurnDown}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "zoomOut", value: null }))
          }
          className="btn-ghost btn"
        >
          <FontAwesomeIcon
            className="scale-150 text-primary"
            icon={faMagnifyingGlassMinus}
          />
        </div>
        <div
          onClick={() =>
            dispatch(addCommand({ command: "zoomIn", value: null }))
          }
          className=" btn-ghost btn"
        >
          <FontAwesomeIcon
            className="scale-150 text-primary"
            icon={faMagnifyingGlassPlus}
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
        className="mr-4 flex h-full items-center space-x-4 text-sm font-light hover:cursor-pointer"
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
