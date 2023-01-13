import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import { getSignVisual } from "../../reducers/signSlice";

const Shapedropdown: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(
    useSelector(getSignVisual).shape
  );

  const shapes = [
    {
      name: "Rectangle",
      key: 0,
      text: "Kantig",
    },
    {
      name: "Rounded Rectangle",
      key: 1,
      text: "Rundad",
    },
    {
      name: "Ellipse",
      key: 2,
      text: "Oval",
    },
  ];

  const getIconSmall = (shape: string) => {
    switch (shape) {
      case "Rectangle":
        //return a rectangle div stroke
        return <div className="w-5 h-5 border border-gray-400 bg-none"></div>;

      case "Rounded Rectangle":
        return (
          <div className="w-5 h-5 border border-gray-400 rounded-sm bg-none"></div>
        );
      case "Ellipse":
        return (
          <div className="w-5 h-5 border border-gray-400 rounded-full bg-none"></div>
        );
    }
  };

  const getIconBig = (shape: string) => {
    switch (shape) {
      case "Rectangle":
        //return a rectangle div stroke
        return (
          <div className="w-12 h-12 border-4 border-primary bg-none"></div>
        );

      case "Rounded Rectangle":
        return (
          <div className="w-12 h-12 border-4 border-primary rounded-md bg-none"></div>
        );
      case "Ellipse":
        return (
          <div className="w-12 h-12 border-4 border-primary  rounded-full bg-none"></div>
        );
    }
  };

  const dispatch = useDispatch();

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    dispatch(
      addCommand({
        command: "setShape",
        value: shape,
      })
    );
  };

  return (
    <div className="dropdown">
      <label
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        tabIndex={0}
        className="btn btn-primary m-1 flex space-x-2 btn-outline"
      >
        <p className="text-content-primary">Form</p>
        {getIconSmall(selectedShape)}
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-80 card-compact bg-base-200 border border-black  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra form</h3>
          <div className="p-4 grid grid-cols-4 gap-24">
            {shapes.map((shape) => (
              <div
                key={shape.key}
                className="flex flex-col space-y-2 hover:cursor-pointer justify-center"
                onClick={() => handleShapeChange(shape.name)}
              >
                {getIconBig(shape.name)}
                <p className="text-neutral-content ">{shape.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shapedropdown;
