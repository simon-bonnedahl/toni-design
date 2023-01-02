import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../reducers/cartSlice";
import CartRow from "../CartRow";

interface Props {
  setShowCartModal: (show: boolean) => void;
}
const CartModal: React.FC<Props> = ({ setShowCartModal }) => {
  const items = useSelector(selectCartItems);
  console.log(items);

  const [groupedItemsInCart, setGroupedItemsInCart] = useState<any[]>([]);

  useMemo(() => {
    const groupedItems = items.reduce((results: any[], item: any) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInCart(groupedItems);
  }, [items]);

  return (
    <div className="absolute top-0 z-50 right-0 w-10/12 h-46 bg-white shadow-lg flex rounded-lg flex-col">
      <div
        className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300"
        onClick={() => setShowCartModal(false)}
      >
        <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff" />
      </div>
      <div className=" p-4">
        {/*header*/}
        <div className="flex font-bold">
          <div className="w-1/12 flex justify-center">Nr</div>
          <div className="w-2/12 flex justify-center">Product</div>
          <div className="w-2/12 flex justify-center">Sign</div>
          <div className="w-2/12 flex justify-center">Size</div>
          <div className="w-1/12 flex justify-center">Price</div>
          <div className="w-2/12 flex justify-center">Quantity</div>
          <div className="w-1/12 flex justify-center">Total</div>
          <div className="w-1/12 flex justify-center"></div>
        </div>
        <div className="flex-col space-y-4">
          {Object.entries(groupedItemsInCart).map(([key, items], index) => (
            <CartRow index={index} quantity={items.length} item={items[0]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
