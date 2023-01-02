import {
  faEdit,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface Props {
  index: number;
  item: any;
  quantity: number;
}

const CartRow: React.FC<Props> = ({ index, item, quantity }) => {
  let blob = new Blob([item.data.svg], { type: "image/svg+xml" });
  let url = URL.createObjectURL(blob);
  let image = document.createElement("img");

  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(
    item.metadata.price * itemQuantity
  );

  if (image) {
    image.src = url;
    image.addEventListener("load", () => {
      URL.revokeObjectURL(url), { once: true };
      let div = document.getElementById("sign-image-" + index);
      if (div) {
        div.innerHTML = "";
        div.appendChild(image);
      }
    });
  }

  let signId = "sign-image-" + index;

  const handleDecreaseItemQuantity = () => {
    setItemQuantity(itemQuantity - 1);
    setTotalPrice(totalPrice - item.metadata.price);
  };
  const handleIncreaseItemQuantity = () => {
    setItemQuantity(itemQuantity + 1);
    setTotalPrice(totalPrice + item.metadata.price);
  };

  return (
    <div className="w-full bg-gray-200 flex rounded-md items-center">
      <div className="w-1/12 border flex justify-center font-bold">
        {index + 1}
      </div>
      <div className="w-2/12 border flex justify-center flex-col">
        <div className="flex justify-center">
          <span className="font-bold">{item.metadata.product}</span>
        </div>
        <div className="flex justify-center text-sm text-gray-600">
          {item.metadata.material} · {item.metadata.colorCombination}
        </div>
        <div className="flex justify-center"></div>
      </div>
      <div className="w-2/12 border flex justify-center" id={signId}>
        {/*image will be loaded here*/}
      </div>
      <div className="w-2/12 border flex justify-center">
        <span className="font-bold">{item.visual.width}</span>x
        <span className="font-bold">{item.visual.height}</span> mm
      </div>
      <div className="w-1/12 border flex justify-center">
        <span className="font-bold font-lg">
          {Math.round(item.metadata.price)} kr
        </span>
      </div>
      <div className="w-2/12 border flex justify-center">
        <div className="flex items-center rounded-md">
          <button
            disabled={itemQuantity === 1}
            onClick={handleDecreaseItemQuantity}
            className="p-4 rounded-md border bg-gray-300"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faMinus} />
          </button>
          <div className="p-4 font-bold">{itemQuantity}</div>
          <button
            onClick={handleIncreaseItemQuantity}
            className="p-4 rounded-md border bg-gray-300"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="w-1/12 border flex justify-center">
        <span className="font-bold font-lg">{Math.round(totalPrice)} kr</span>
      </div>
      <div className="w-1/12 border flex justify-around">
        <div>
          <FontAwesomeIcon className="h-6" icon={faEdit} color="gray" />
        </div>
        <div>
          <FontAwesomeIcon className="h-6" icon={faTrashCan} color="red" />
        </div>
      </div>
    </div>
  );
};

export default CartRow;
