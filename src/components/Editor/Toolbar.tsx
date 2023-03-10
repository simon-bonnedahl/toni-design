import {
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotateBack,
  faTurnDown,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ToolbarProps } from "../../types/sign";
import Applicationdropdown from "./dropdowns/Applicationdropdown";
import Colordropdown from "./dropdowns/Colordropdown";
import Imagedropdown from "./dropdowns/Imagedropdown";
import Productdropdown from "./dropdowns/Productdropdown";
import Shapedropdown from "./dropdowns/Shapedropdown";
import Sizedropdown from "./dropdowns/Sizedropdown";
import Textdropdown from "./dropdowns/Textdrowdown";

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const openSizeDropdown = () => {
    document.getElementById("size-dropdown")?.focus();
  };

  return (
    <div className="flex h-16 w-screen flex-row items-center justify-between bg-base-200 ">
      <div className="flex h-full items-center pl-4">
        <div
          onClick={() => props.restart()}
          className="too btn btn-ghost tooltip flex"
          data-tip="Börja om"
        >
          <FontAwesomeIcon className="scale-150" icon={faRotateBack} />
        </div>
        <div
          onClick={() => props.undo()}
          className="btn btn-ghost tooltip flex"
          data-tip="Gå tillbaka"
        >
          <FontAwesomeIcon className="-rotate-90 scale-150" icon={faTurnUp} />
        </div>
        <div
          onClick={() => props.redo()}
          className=" btn btn-ghost tooltip flex"
          data-tip="Gå fram"
        >
          <FontAwesomeIcon className="-rotate-90 scale-150" icon={faTurnDown} />
        </div>
        <div
          onClick={() => props.zoomOut()}
          className="btn btn-ghost tooltip flex"
          data-tip="Zooma ut"
        >
          <FontAwesomeIcon
            className="scale-150 "
            icon={faMagnifyingGlassMinus}
          />
        </div>
        <div>{props.zoom * 100}%</div>
        <div
          onClick={() => props.zoomIn()}
          className=" btn btn-ghost tooltip flex"
          data-tip="Zooma in"
        >
          <FontAwesomeIcon className="scale-150" icon={faMagnifyingGlassPlus} />
        </div>
      </div>
      {/*Dropdowns*/}

      <div className="flex">
        <Productdropdown />
        <Applicationdropdown
          sign={props.sign}
          setApplication={props.setApplication}
        />
        <Sizedropdown sign={props.sign} setSize={props.setSize} />
        <Colordropdown sign={props.sign} setColor={props.setColor} />
        <Shapedropdown sign={props.sign} setShape={props.setShape} />
        <Textdropdown sign={props.sign} addText={props.addText} />
        <Imagedropdown sign={props.sign} addImage={props.addImage} />
      </div>
      {/*Size*/}
      <div
        onClick={openSizeDropdown}
        className="mr-4 flex h-full items-center space-x-4 text-sm font-light hover:cursor-pointer"
      >
        <div>
          <span className="font-bold">Bredd:</span> {props.sign.width} mm
        </div>
        <div>
          <span className="font-bold"> Höjd:</span> {props.sign.height} mm
        </div>
        <div>
          <span className="font-bold">Djup:</span> {props.sign.depth} mm
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
