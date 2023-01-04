import {
  faArrowLeft,
  faArrowRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../reducers/cartSlice";
import CartRow from "../CartRow";

interface Props {
  setShowCartModal: (show: boolean) => void;
}
const CartModal: React.FC<Props> = ({ setShowCartModal }) => {
  const items = useSelector(selectCartItems);

  const [groupedItemsInCart, setGroupedItemsInCart] = useState<any[]>([]);

  const total = useSelector(selectCartTotal);

  useMemo(() => {
    const groupedItems = items.reduce((results: any[], item: any) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInCart(groupedItems);
  }, [items]);

  const handleCheckout = async () => {
    fetch("/api/ordermail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    }).then((res) => {
      res.json();
      console.log(res);
      if (res.status == 200) {
        alert("Order placed successfully");
      } else {
        alert("Something went wrong");
      }
    });
  };

  const round = (number: number, precision: number) => {
    return (
      Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    );
  };

  return (
    <div className="absolute top-0 z-50 right-0 w-10/12 h-46 bg-base-100 shadow-lg flex rounded-lg flex-col ">
      <div className=" p-4">
        {/*header*/}
        <div className="flex font-bold text-base-content">
          <div className="w-1/12 flex justify-center">Nummer</div>
          <div className="w-2/12 flex justify-center">Produkt</div>
          <div className="w-2/12 flex justify-center">Skylt</div>
          <div className="w-2/12 flex justify-center">Storlek</div>
          <div className="w-1/12 flex justify-center">Pris</div>
          <div className="w-2/12 flex justify-center">Antal</div>
          <div className="w-1/12 flex justify-center">Belopp</div>
          <div className="w-1/12 flex justify-center"></div>
        </div>
        <div className="flex-col space-y-2 max-h-96 overflow-y-scroll">
          {Object.entries(groupedItemsInCart).map(([key, items], index) => (
            <CartRow
              key={key}
              index={index}
              quantity={items.length}
              item={items[0]}
            />
          ))}
        </div>
        {/*checkout info and total*/}
        <div className="flex flex-col mt-4 border-t-2 border-base-content text-base-content items-end">
          <div className="flex flex-col w-64 mt-4 space-y-1">
            <div className="flex justify-between">
              <span className="">Frakt:</span>
              <span className="">39,20 kr</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Pris exkl. moms:</span>
              <span className="font-bold">{round(total, 2)} kr</span>
            </div>
            <div className="flex justify-between">
              <span className="">Moms(25%):</span>
              <span className="">{round(total * 0.25, 2)} kr</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Totalt inkl. moms:</span>
              <span className="font-bold">
                {round(total * 1.25 + 39.2, 2)} kr
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2 w-full mt-4">
            <button
              onClick={() => setShowCartModal(false)}
              className="btn btn-info btn-outline text-neutral-content font-bold py-2 px-4 rounded"
            >
              <FontAwesomeIcon
                className="w-4 h-4 text-content-info mr-2"
                icon={faArrowLeft}
              />
              Fortsätt
            </button>
            <button
              onClick={handleCheckout}
              className="btn btn-success btn-outline"
            >
              Gå till kassan
              <FontAwesomeIcon
                className="w-4 h-4 text-content-info ml-2"
                icon={faArrowRight}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
