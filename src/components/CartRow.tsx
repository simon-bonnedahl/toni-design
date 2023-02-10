import {
  faEdit,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../reducers/cartSlice";
import { setSign } from "../../reducers/signSlice";

interface Props {
  index: number;
  item: any;
  quantity: number;
}

const CartRow: React.FC<Props> = ({ index, item, quantity }) => {
  const router = useRouter();

  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(
    item.metadata.price * itemQuantity
  );
  const dispatch = useDispatch();

  const signId = "sign-image-" + index;

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
  const handleRemoveItem = () => {
    for (let i = 0; i < itemQuantity; i++) {
      dispatch(removeFromCart({ id: item.id }));
    }
  };
  const handleOpenSign = () => {
    console.log(item);
    //dispatch(setSign({ sign: item }));
    //put the sign in the localStorage
    localStorage.setItem("sign", JSON.stringify(item));
    router.push("/");

    //dispatch(addCommand({ command: "reCreate", value: item.visual }));

    //handleRemoveItem();
  };

  let className = "w-full flex rounded items-center text-base-content";
  if (index % 2 === 0) {
    className += " bg-base-200";
  } else {
    className += " bg-base-100";
  }

  useEffect(() => {
    const image = document.createElement("img");
    image.src = item.data.pixelData;
    image.addEventListener("load", () => {
      URL.revokeObjectURL(item.data.pixelData), { once: true };
      const div = document.getElementById("sign-image-" + index);
      if (div) {
        div.innerHTML = "";
        div.appendChild(image);
      }
    });
  });

  return (
    <div className={className}>
      <div className="flex w-1/12 justify-center font-bold">{index + 1}</div>
      <div className="flex w-2/12 flex-col justify-center">
        <div className="flex justify-center">
          <span className="font-bold">{item.metadata.product}</span>
        </div>
        <div className="flex justify-center text-sm text-gray-600">
          {item.metadata.material} · {item.metadata.colorCombination}
        </div>
        <div className="flex justify-center"></div>
      </div>
      <div className="flex w-2/12 justify-center" id={signId}>
        {/*image will be loaded here*/}
      </div>
      <div className="flex w-2/12 justify-center">
        <span className="font-bold">{item.visual.width}</span>x
        <span className="font-bold">{item.visual.height}</span> mm
      </div>
      <div className="flex w-1/12 justify-center">
        <span className="font-lg font-bold">
          {Math.round(item.metadata.price)} kr
        </span>
      </div>
      <div className="flex w-2/12 justify-center">
        <div className="flex items-center rounded-md">
          <button
            disabled={itemQuantity === 1}
            onClick={handleDecreaseItemQuantity}
            className="btn-neutral btn"
          >
            <FontAwesomeIcon className="h-3 w-3" icon={faMinus} />
          </button>
          <div className="p-4 font-bold">{itemQuantity}</div>
          <button
            onClick={handleIncreaseItemQuantity}
            className="btn-neutral btn"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="flex  w-1/12 justify-center">
        <span className="font-lg font-bold">{Math.round(totalPrice)} kr</span>
      </div>
      <div className="flex  w-1/12 justify-around">
        <div
          onClick={handleOpenSign}
          className="duration-300 ease-in-out hover:scale-125 hover:cursor-pointer"
        >
          <FontAwesomeIcon className="scale-150" icon={faEdit} color="gray" />
        </div>
        <div
          onClick={handleRemoveItem}
          className="duration-300 ease-in-out hover:scale-125 hover:cursor-pointer"
        >
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
