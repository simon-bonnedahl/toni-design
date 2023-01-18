import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../../reducers/editorSlice";
import { getSignVisual } from "../../../reducers/signSlice";

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
        return <div className="h-5 w-5 border border-gray-400 bg-none"></div>;

      case "Rounded Rectangle":
        return (
          <div className="h-5 w-5 rounded-sm border border-gray-400 bg-none"></div>
        );
      case "Ellipse":
        return (
          <div className="h-5 w-5 rounded-full border border-gray-400 bg-none"></div>
        );
    }
  };

  const getIconBig = (shape: string) => {
    switch (shape) {
      case "Rectangle":
        //return a rectangle div stroke
        return (
          <div className="h-12 w-12 border-4 border-primary bg-none"></div>
        );

      case "Rounded Rectangle":
        return (
          <div className="h-12 w-12 rounded-md border-4 border-primary bg-none"></div>
        );
      case "Ellipse":
        return (
          <div className="h-12 w-12 rounded-full border-4  border-primary bg-none"></div>
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
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Form</p>
        {getIconSmall(selectedShape)}
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra form</h3>
          <div className="grid grid-cols-4 gap-24 p-4">
            {shapes.map((shape) => (
              <div
                key={shape.key}
                className="flex flex-col justify-center space-y-2 hover:cursor-pointer"
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
