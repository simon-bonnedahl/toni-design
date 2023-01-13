import { faDroplet, faT } from "@fortawesome/free-solid-svg-icons";
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

const Colordropdown: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState(
    useSelector(getSignVisual).color
  );
  const product = useSelector(getSignMetadata).product;

  const [colorOptions, setColorOptions] = useState<any[]>([]);

  useEffect(() => {
    //https://www.sanity.io/docs/js-client
    //const query = '*[_type == "bike" && seats >= $minSeats] {name, seats}'
    const query = '*[_type == "colorOption"]';
    const params = {};

    client.fetch(query, params).then((data: any) => {
      setColorOptions(data);
    });
  }, []);

  const dispatch = useDispatch();

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let color = event.target.value;
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
        className="btn btn-primary m-1 flex space-x-2 btn-outline"
      >
        <p className="text-content-primary">Färg</p>

        <FontAwesomeIcon className="scale-110" icon={faDroplet} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-80 card-compact bg-base-200 border border-black p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra färg</h3>
          {product === "Engraved Sign" ? (
            <div className="p-4 grid grid-cols-4 gap-16">
              {colorOptions.map((option, key) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    onClick={() => handleEngravedColorChange(option)}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:cursor-pointer"
                    style={{ backgroundColor: option.frontColorValue }}
                  >
                    <FontAwesomeIcon
                      className="w-8 h-8 p-1"
                      icon={faT}
                      color={option.backColorValue}
                    />
                  </div>
                  <p className="text-xs text-neutral-content  font-light">
                    {option.name.split("/")[0]}
                  </p>
                  <p className="text-xs text-neutral-content font-light">
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
                  className="rounded-lg ml-4"
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
