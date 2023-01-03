import {
  faCircle,
  faCube,
  faDroplet,
  faExpand,
  faFileText,
  faImage,
  faPaintRoller,
  faQuestion,
  faUsersRectangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  IconLookup,
  IconDefinition,
  findIconDefinition,
  library,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import {
  getSignMetadata,
  getSignVisual,
  setSignColorCombination,
} from "../../reducers/signSlice";
import client from "../../sanity";
import { faRectangleTimes } from "@fortawesome/free-regular-svg-icons";

const Textdropdown: React.FC = () => {
  const [text, setText] = useState({
    string: "",
    font: "Arial",
    color: "Black",
  });
  const fonts = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Georgia",
    "Times New Roman",
    "Garmond",
    "Courier New",
    "Brush Script MT",
  ];
  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#ffffff" },
    { name: "Red", hex: "#ff0000" },
    { name: "Green", hex: "#00ff00" },
    { name: "Blue", hex: "#0000ff" },
    { name: "Brun", hex: "#8B4513" },
  ];
  const dispatch = useDispatch();

  const handleAddText = () => {
    let string = (document.getElementById("text-input") as HTMLInputElement)
      .value;
    let font = (document.getElementById("font-select") as HTMLInputElement)
      .value;
    let color = (document.getElementById("color-select") as HTMLInputElement)
      .value;
    let t = {
      string: string,
      font: font,
      fontSize: 40,
      color: color,
    };
    setText(t);
    dispatch(addCommand({ command: "addText", value: t }));
  };
  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn btn-primary btn-outline m-1 flex space-x-2"
      >
        <p className="text-content-primary">Text</p>
        <FontAwesomeIcon icon={faFileText} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-80 card-compact bg-neutral p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Lägg till en text</h3>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-primary w-full max-w-xs"
            id="text-input"
          />
          <select
            defaultValue={fonts[0]}
            id="font-select"
            className="select select-primary w-full max-w-xs"
          >
            {fonts.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
          <button
            onClick={handleAddText}
            className="btn btn-primary w-fill mt-4"
          >
            Lägg till
          </button>
        </div>
      </div>
    </div>
  );
};

export default Textdropdown;
