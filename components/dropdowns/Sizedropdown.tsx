import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import { getSignVisual } from "../../reducers/signSlice";

const Sizedropdown: React.FC = () => {
  const [width, setWidth] = useState(useSelector(getSignVisual).width);
  const [height, setHeight] = useState(useSelector(getSignVisual).height);

  const dispatch = useDispatch();
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let width = event.target.valueAsNumber;
    setWidth(width);
    if (5 <= width && width <= 400) {
      dispatch(
        addCommand({
          command: "setSize",
          value: { width: width, height: height },
        })
      );
    }
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let height = event.target.valueAsNumber;
    setHeight(height);
    if (5 <= height && height <= 200) {
      dispatch(
        addCommand({
          command: "setSize",
          value: { width: width, height: height },
        })
      );
    }
  };

  return (
    <div className="dropdown">
      <label
        id="size-dropdown"
        tabIndex={0}
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        className="btn btn-primary m-1 flex space-x-2 btn-outline"
      >
        <p className="text-content-primary">Storlek</p>

        <FontAwesomeIcon icon={faExpand} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-80 card-compact p-2 shadow bg-neutral"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra storlek</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text"></span>
            </label>
            <label className="input-group">
              <span className="bg-primary text-primary-content w-28">
                Bredd
              </span>
              <input
                className="input-md input-bordered w-full"
                type="number"
                value={width}
                onChange={handleWidthChange}
                min={5}
                max={400}
                step={5}
              />
              <span className="bg-primary text-primary-content">mm</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"></span>
            </label>
            <label className="input-group">
              <span className="bg-primary text-primary-content w-28">
                Höjd{" "}
              </span>
              <input
                className="input-md input-bordered w-full"
                type="number"
                value={height}
                onChange={handleHeightChange}
                min={5}
                max={200}
                step={5}
              />
              <span className="bg-primary text-primary-content">mm</span>
            </label>
          </div>
          <div className="form-control mt-4">
            <div className="input-group">
              <span className="bg-primary text-primary-content">Djup</span>
              <select
                defaultValue={1.0}
                className="select select-bordered w-7/12"
              >
                <option>1.0</option>
                <option>0.5</option>
              </select>
              <span className="bg-primary text-primary-content">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sizedropdown;
