import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faTrash,
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
    <div className="absolute top-3/4 left-2/4 flex h-16 w-80 items-center justify-end space-x-4 rounded-md border border-black bg-gray-100 p-4">
      <div
        onClick={handleAlignLeft}
        className="duration-300 ease-in-out hover:scale-110 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignLeft}
          color="gray"
        />
      </div>
      <div
        onClick={handleAlignCenter}
        className="duration-300 ease-in-out hover:scale-110 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignCenter}
          color="gray"
        />
      </div>
      <div
        onClick={handleAlignRight}
        className="duration-300 ease-in-out hover:scale-110 hover:cursor-pointer"
      >
        <FontAwesomeIcon
          className="scale-125"
          icon={faAlignRight}
          color="gray"
        />
      </div>
      <div
        onClick={handleDelete}
        className="duration-300 ease-in-out hover:scale-110 hover:cursor-pointer"
      >
        <FontAwesomeIcon className="scale-125" icon={faTrash} color="red" />
      </div>
    </div>
  );
};

export default ControlBox;
