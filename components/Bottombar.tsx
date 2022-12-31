import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import { getSignJSON, getSignMetadata } from "../reducers/signSlice";

const Bottombar: React.FC = () => {
  const price = useSelector(getSignMetadata).price;
  const json = useSelector(getSignJSON);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);

  const handleDownloadJSON = () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    var a = document.createElement("a");
    a.href = dataStr;
    a.download = "download.json";
    a.click();
  };

  return (
    <div className="flex flex-row w-full h-20 border items-center justify-between px-4">
      <div className="flex space-x-4">
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "SVG" }))
          }
        >
          Download SVG
        </button>
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "PDF" }))
          }
        >
          Download PDF
        </button>
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={handleDownloadJSON}
        >
          Download JSON
        </button>
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="font-bold text-xl">{Math.round(price)}</span> kr
        </div>
        {/*Increase and Decrease*/}
        <div className="flex items-center rounded-md">
          <button
            disabled={amount === 0}
            onClick={() => setAmount(amount - 1)}
            className="p-4 rounded-md border bg-gray-200"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faMinus} />
          </button>
          <div className="p-4">{amount}</div>
          <button
            onClick={() => setAmount(amount + 1)}
            className="p-4 rounded-md border bg-gray-200"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faPlus} />
          </button>
        </div>
        {/*Add button */}
        <div>
          <button className="p-3 rounded-md bg-blue-400 text-white text-light text-sm">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
