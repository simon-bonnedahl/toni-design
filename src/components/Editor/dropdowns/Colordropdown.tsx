import { faDroplet, faT } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Sign, SignTypes } from "../../../types/sign.d";
import { trpc } from "../../../utils/trpc";

type Props = {
  sign: Sign;
  setColor: (background: string, foreground: string) => void;
};

const Colordropdown: React.FC<Props> = ({ sign, setColor }) => {
  const colorOptions = trpc.color.getColors.useQuery().data || [];

  return (
    <div className="dropdown tooltip" data-tip="Färg">
      <label tabIndex={0} className="btn-primary btn-ghost btn">
        <FontAwesomeIcon className="scale-150" icon={faDroplet} />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200 p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Ändra färg</h3>
          {sign.type === SignTypes.ENGRAVED ? (
            <div className="grid grid-cols-4 gap-16 p-4">
              {colorOptions.map((option: any, key: string) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    onClick={() =>
                      setColor(option.frontColorValue, option.backColorValue)
                    }
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
                <input className="ml-4 rounded-lg" type="color" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Colordropdown;
