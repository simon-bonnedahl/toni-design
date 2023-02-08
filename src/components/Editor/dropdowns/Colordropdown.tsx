import { faDroplet, faT } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../../../reducers/editorSlice";
import {
  getSignMetadata,
  getSignVisual,
  setSignColorCombination,
} from "../../../../reducers/signSlice";
import client from "../../../../sanity";
import { trpc } from "../../../utils/trpc";

const Colordropdown: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState(
    useSelector(getSignVisual).color
  );
  const product = useSelector(getSignMetadata).product;

  const colorOptions = trpc.color.getColors.useQuery().data || [];

  const dispatch = useDispatch();

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
    dispatch(
      addCommand({
        command: "setColor",
        value: color,
      })
    );
  };

  const handleEngravedColorChange = (option: any) => {
    dispatch(
      addCommand({
        command: "setColor",
        value: option,
      })
    );
    dispatch(setSignColorCombination({ colorCombination: option.name }));
  };

  return (
    <div className="dropdown">
      <label
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        tabIndex={0}
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Färg</p>

        <FontAwesomeIcon className="scale-110" icon={faDroplet} />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200 p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra färg</h3>
          {product === "Engraved Sign" ? (
            <div className="grid grid-cols-4 gap-16 p-4">
              {colorOptions.map((option: any, key: string) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    onClick={() => handleEngravedColorChange(option)}
                    className="flex h-12 w-12 items-center justify-center rounded-full hover:cursor-pointer"
                    style={{ backgroundColor: option.frontColorValue }}
                  >
                    <FontAwesomeIcon
                      className="h-8 w-8 p-1"
                      icon={faT}
                      color={option.backColorValue}
                    />
                  </div>
                  <p className="text-xs font-light  text-neutral-content">
                    {option.name.split("/")[0]}
                  </p>
                  <p className="text-xs font-light text-neutral-content">
                    {option.name.split("/")[1]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full p-5">
              <label>
                Color:
                <input
                  className="ml-4 rounded-lg"
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Colordropdown;
