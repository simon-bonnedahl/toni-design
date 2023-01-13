import {
  faArrowRight,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../reducers/cartSlice";
import CartRow from "./CartRow";

const Cart: React.FC = () => {
  const items = useSelector(selectCartItems);

  const [groupedItemsInCart, setGroupedItemsInCart] = useState<any[]>([]);

  const total = useSelector(selectCartTotal);
  const router = useRouter();
  const [error, setError] = useState("");

  useMemo(() => {
    const groupedItems = items.reduce((results: any[], item: any) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInCart(groupedItems);
  }, [items]);

  const handleCheckout = async () => {
    if (items.length < 1) {
      setError("Du har inget din varukorg");
    } else {
      setError("");
      router.push("/checkout");
    }
  };

  const round = (number: number, precision: number) => {
    return (
      Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    );
  };
  return (
    <div className="dropdown">
      <label id="cart-button" tabIndex={0} className="btn btn-ghost">
        <div className="flex space-x-4">
          <div className="indicator">
            <FontAwesomeIcon className="scale-110" icon={faCartShopping} />
            <span className="badge badge-warning badge-xs indicator-item ml-">
              {items.length}
            </span>
          </div>
          <span className="text-base-content">Varukorg</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="dropdown-content -right-0 card w-[82vw] border border-neutral card-compact bg-base-100 p-2 shadow"
      >
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
                <span className="font-bold">Pris exkl. moms:</span>
                <span className="font-bold">{round(total, 2)} kr</span>
              </div>
              <div className="flex justify-between">
                <span className="">Moms(25%):</span>
                <span className="">{round(total * 0.25, 2)} kr</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Totalt inkl. moms:</span>
                <span className="font-bold">{round(total * 1.25, 2)} kr</span>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 w-full mt-4">
              <button onClick={handleCheckout} className="btn btn-success">
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
    </div>
  );
};

export default Cart;
