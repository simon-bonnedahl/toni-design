import { faFileText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../../../reducers/editorSlice";
import { getSignVisual } from "../../../../reducers/signSlice";
import { Sign, Text } from "../../../types/sign.d";

type Props = {
  sign: Sign;
  addText: (text: Text) => void;
};

const Textdropdown: React.FC<Props> = ({ sign, addText }) => {
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
  const dispatch = useDispatch();

  const handleAddText = () => {
    const string = (document.getElementById("text-input") as HTMLInputElement)
      .value;
    const font = (document.getElementById("font-select") as HTMLInputElement)
      .value;
    const text: Text = {
      text: string,
      fontFamily: font,
      fontSize: 40,
    };
    addText(text);
  };
  return (
    <div className="dropdown">
      <label
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        tabIndex={0}
        className="btn-outline btn-primary btn m-1 p-4"
      >
        <FontAwesomeIcon icon={faFileText} className="scale-150" />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200 p-2"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Lägg till en text</h3>
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input-primary input w-full max-w-xs"
            id="text-input"
          />
          <select
            defaultValue={fonts[0]}
            id="font-select"
            className="select-primary select w-full max-w-xs"
          >
            {fonts.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
          <button
            onClick={handleAddText}
            className="w-fill btn-primary btn mt-4"
          >
            Lägg till
          </button>
        </div>
      </div>
    </div>
  );
};

export default Textdropdown;
