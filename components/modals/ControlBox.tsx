import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  handleDelete: () => void;
  handleAlignCenter: () => void;
  handleAlignLeft: () => void;
  handleAlignRight: () => void;
}

const ControlBox: React.FC<Props> = ({
  handleDelete,
  handleAlignCenter,
  handleAlignLeft,
  handleAlignRight,
}: Props) => {
  return (
    <div className="flex items-center space-x-4 p-4 justify-end bg-gray-100 absolute w-80 rounded-md border border-black h-16 top-3/4 left-2/4">
      <div
        onClick={handleAlignLeft}
        className="hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignLeft}
          color="gray"
        />
      </div>
      <div
        onClick={handleAlignCenter}
        className="hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignCenter}
          color="gray"
        />
      </div>
      <div
        onClick={handleAlignRight}
        className="hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignRight}
          color="gray"
        />
      </div>
      <div
        onClick={handleDelete}
        className="hover:scale-110 ease-in-out duration-300 hover:cursor-pointer"
      >
        <FontAwesomeIcon className="scale-125" icon={faTrashCan} color="red" />
      </div>
    </div>
  );
};

export default ControlBox;
