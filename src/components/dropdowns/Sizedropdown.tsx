import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addCommand } from "../../../reducers/editorSlice";
import { getSignVisual } from "../../../reducers/signSlice";

const Sizedropdown: React.FC = () => {
  const [width, setWidth] = useState(useSelector(getSignVisual).width);
  const [height, setHeight] = useState(useSelector(getSignVisual).height);
  const MIN_HEIHGT = 5;
  const MAX_HEIGHT = 200;
  const MIN_WIDTH = 5;
  const MAX_WIDTH = 400;

  const dispatch = useDispatch();

  const handleSetSize = () => {
    if (!(MIN_WIDTH <= width && width <= MAX_WIDTH)) {
      toast.error(
        "Bredd: Endast " +
          MIN_WIDTH +
          " - " +
          MAX_WIDTH +
          " mm" +
          " är tillåtet"
      );
      return;
    }
    if (!(MIN_HEIHGT <= height && height <= MAX_HEIGHT)) {
      toast.error(
        "Höjd: Endast " +
          MIN_HEIHGT +
          " - " +
          MAX_HEIGHT +
          " mm" +
          " är tillåtet"
      );
      return;
    }
    console.log("Sending");
    dispatch(
      addCommand({
        command: "setSize",
        value: { width: width, height: height },
      })
    );
  };

  return (
    <div className="dropdown">
      <label
        id="size-dropdown"
        tabIndex={0}
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Storlek</p>

        <FontAwesomeIcon icon={faExpand} className="scale-110" />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200 p-2 "
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra storlek</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text"></span>
            </label>
            <label className="input-group">
              <span className="w-28 bg-primary text-primary-content">
                Bredd
              </span>
              <input
                className="input w-full"
                type="number"
                id="widthInput"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <span className="bg-primary text-primary-content">mm</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"></span>
            </label>
            <label className="input-group">
              <span className="w-28 bg-primary text-primary-content">Höjd</span>
              <input
                className="input w-full bg-base-100"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="bg-primary text-primary-content">mm</span>
            </label>
          </div>
          <div className="form-control mt-4">
            <div className="input-group">
              <span className="bg-primary text-primary-content">Djup</span>
              <select defaultValue={1.0} className="select w-7/12 bg-base-100">
                <option>1.0</option>
                <option>0.5</option>
              </select>
              <span className="bg-primary text-primary-content">mm</span>
            </div>
          </div>
          <button className="btn-primary btn mt-4" onClick={handleSetSize}>
            Applicera
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sizedropdown;
