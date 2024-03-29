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
import {
  addToCart,
  removeFromCart,
  toggleModify,
} from "../../reducers/cartSlice";
import type { AdjustableProduct } from "../types/product";
import { Sign } from "../types/sign";

interface Props {
  index: number;
  item: AdjustableProduct;
  quantity: number;
}

const CartRow: React.FC<Props> = ({ index, item, quantity }) => {
  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState(item.price * quantity);
  const dispatch = useDispatch();

  const signId = "sign-image-" + index;

  const handleDecreaseItemQuantity = () => {
    dispatch(removeFromCart({ id: item.id }));
  };
  const handleIncreaseItemQuantity = () => {
    dispatch(addToCart(item));
  };
  const handleRemoveItem = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(removeFromCart({ id: item.id }));
    }
  };
  const handleOpenSign = (sign: Sign) => {
    localStorage.setItem("sign", JSON.stringify(sign));
    if (router.pathname === "/") {
      dispatch(toggleModify());
    } else router.push("/");
  };

  let className = "w-full flex rounded items-center text-base-content";
  if (index % 2 === 0) {
    className += " bg-base-200";
  } else {
    className += " bg-base-100";
  }

  useEffect(() => {
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.addEventListener("load", () => {
      URL.revokeObjectURL(item.imageUrl), { once: true };
      const div = document.getElementById("sign-image-" + index);
      if (div) {
        image.classList.add("w-20", "h-20", "object-contain");
        div.innerHTML = "";
        div.appendChild(image);
      }
    });
  });

  useEffect(() => {
    setTotalPrice(item.price * quantity);
  }, [quantity]);

  return (
    <div className={className}>
      <div className="flex w-1/12 justify-center font-bold">{index + 1}</div>
      <div className="flex w-2/12 flex-col justify-center">
        <div className="flex justify-center">
          <span className="font-bold">{item.title}</span>
        </div>
        {item.sign && (
          <div className="flex justify-center text-sm text-gray-600">
            Plast · {item.sign.colorCombination}
          </div>
        )}

        <div className="flex justify-center"></div>
      </div>
      <div className="flex w-2/12 justify-center" id={signId}>
        {/*image will be loaded here*/}
      </div>
      <div className="flex w-2/12 justify-center">
        <span className="font-bold">{item.width}</span>x
        <span className="font-bold">{item.height}</span> mm
      </div>
      <div className="flex w-1/12 justify-center">
        <span className="font-lg font-bold">{Math.round(item.price)} kr</span>
      </div>
      <div className="flex w-2/12 justify-center">
        <div className="flex items-center rounded-md">
          <button
            onClick={handleDecreaseItemQuantity}
            className="btn-neutral btn"
          >
            <FontAwesomeIcon className="h-3 w-3" icon={faMinus} />
          </button>
          <div className="p-4 font-bold">{quantity}</div>
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
          onClick={() => handleOpenSign(item.sign)}
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
