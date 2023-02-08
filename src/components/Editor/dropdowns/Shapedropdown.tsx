import { Shapes, Sign } from "../../../types/sign.d";

type Props = {
  sign: Sign;
  setShape: (shape: Shapes) => void;
};

const Shapedropdown: React.FC<Props> = ({ sign, setShape }) => {
  const shapes = [
    {
      shape: Shapes.RECTANGLE,
      text: "Kantig",
    },
    {
      shape: Shapes.ROUNDED_RECTANGLE,
      text: "Rundad",
    },
    {
      shape: Shapes.ELLIPSE,
      text: "Oval",
    },
  ];

  const getIconSmall = (shape: Shapes) => {
    switch (shape) {
      case Shapes.RECTANGLE:
        //return a rectangle div stroke
        return <div className="h-5 w-5 border border-gray-400 bg-none"></div>;

      case Shapes.ROUNDED_RECTANGLE:
        return (
          <div className="h-5 w-5 rounded-sm border border-gray-400 bg-none"></div>
        );
      case Shapes.ELLIPSE:
        return (
          <div className="h-5 w-5 rounded-full border border-gray-400 bg-none"></div>
        );
    }
  };

  const getIconBig = (shape: Shapes) => {
    switch (shape) {
      case Shapes.RECTANGLE:
        //return a rectangle div stroke
        return (
          <div className="h-12 w-12 border-4 border-primary bg-none"></div>
        );

      case Shapes.ROUNDED_RECTANGLE:
        return (
          <div className="h-12 w-12 rounded-md border-4 border-primary bg-none"></div>
        );
      case Shapes.ELLIPSE:
        return (
          <div className="h-12 w-12 rounded-full border-4  border-primary bg-none"></div>
        );
    }
  };

  return (
    <div className="dropdown">
      <label tabIndex={0} className="p4 btn-outline btn-primary btn m-1">
        {getIconSmall(sign.shape)}
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra form</h3>
          <div className="grid grid-cols-4 gap-24 p-4">
            {shapes.map((shape, key) => (
              <div
                key={key}
                className="flex flex-col justify-center space-y-2 hover:cursor-pointer"
                onClick={() => setShape(shape.shape)}
              >
                {getIconBig(shape.shape)}
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
