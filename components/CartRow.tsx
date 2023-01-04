import {
  faEdit,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../reducers/cartSlice";

interface Props {
  index: number;
  item: any;
  quantity: number;
}

const CartRow: React.FC<Props> = ({ index, item, quantity }) => {
  let image = document.createElement("img");

  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(
    item.metadata.price * itemQuantity
  );
  const dispatch = useDispatch();

  if (image) {
    image.src = item.data.pixelData;
    image.addEventListener("load", () => {
      URL.revokeObjectURL(item.data.pixelData), { once: true };
      let div = document.getElementById("sign-image-" + index);
      if (div) {
        div.innerHTML = "";
        div.appendChild(image);
      }
    });
  }

  let signId = "sign-image-" + index;

  const handleDecreaseItemQuantity = () => {
    dispatch(removeFromCart({ id: item.id }));
    setItemQuantity(itemQuantity - 1);
    setTotalPrice(totalPrice - item.metadata.price);
  };
  const handleIncreaseItemQuantity = () => {
    dispatch(addToCart(item));
    setItemQuantity(itemQuantity + 1);
    setTotalPrice(totalPrice + item.metadata.price);
  };

  let className = "w-full flex rounded items-center text-base-content";
  if (index % 2 === 0) {
    className += " bg-base-200";
  } else {
    className += " bg-base-100";
  }

  return (
    <div className={className}>
      <div className="w-1/12 flex justify-center font-bold">{index + 1}</div>
      <div className="w-2/12 flex justify-center flex-col">
        <div className="flex justify-center">
          <span className="font-bold">{item.metadata.product}</span>
        </div>
        <div className="flex justify-center text-sm text-gray-600">
          {item.metadata.material} · {item.metadata.colorCombination}
        </div>
        <div className="flex justify-center"></div>
      </div>
      <div className="w-2/12 flex justify-center" id={signId}>
        {/*image will be loaded here*/}
      </div>
      <div className="w-2/12 flex justify-center">
        <span className="font-bold">{item.visual.width}</span>x
        <span className="font-bold">{item.visual.height}</span> mm
      </div>
      <div className="w-1/12 flex justify-center">
        <span className="font-bold font-lg">
          {Math.round(item.metadata.price)} kr
        </span>
      </div>
      <div className="w-2/12 flex justify-center">
        <div className="flex items-center rounded-md">
          <button
            disabled={itemQuantity === 1}
            onClick={handleDecreaseItemQuantity}
            className="btn btn-neutral"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faMinus} />
          </button>
          <div className="p-4 font-bold">{itemQuantity}</div>
          <button
            onClick={handleIncreaseItemQuantity}
            className="btn btn-neutral"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="w-1/12  flex justify-center">
        <span className="font-bold font-lg">{Math.round(totalPrice)} kr</span>
      </div>
      <div className="w-1/12  flex justify-around">
        <div className="hover:cursor-pointer hover:scale-125 ease-in-out duration-300">
          <FontAwesomeIcon className="scale-150" icon={faEdit} color="gray" />
        </div>
        <div className="hover:cursor-pointer hover:scale-125 ease-in-out duration-300">
          <FontAwesomeIcon
            className="scale-150"
            icon={faTrashCan}
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

export default CartRow;
