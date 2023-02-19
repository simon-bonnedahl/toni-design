import {
  faArrowRight,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getItemQuantity,
  selectCartItems,
  selectCartTotal,
} from "../../reducers/cartSlice";
import CartRow from "./CartRow";

const Cart: React.FC = () => {
  const items = useSelector(selectCartItems);

  const [groupedItemsInCart, setGroupedItemsInCart] = useState<any[]>([]);

  const total = useSelector(selectCartTotal);
  const router = useRouter();

  useMemo(() => {
    const groupedItems = items.reduce((results: any[], item: any) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInCart(groupedItems);
  }, [items]);

  const handleCheckout = async () => {
    if (items.length < 1) {
      toast.error("Kundvagnen är tom");
      return;
    }
    router.push("/checkout");
  };

  const round = (number: number, precision: number) => {
    return (
      Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    );
  };

  return (
    <div className="dropdown">
      <label id="cart-button" tabIndex={0} className="btn btn-ghost">
        <div className="flex space-x-2">
          <div className="indicator">
            <FontAwesomeIcon className="scale-110" icon={faCartShopping} />
            {items.length > 0 && (
              <span className="ml- badge-warning badge badge-xs indicator-item">
                {items.length}
              </span>
            )}
          </div>
          <span className="text-base-content">Varukorg</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content -right-0 w-[82vw] border border-neutral bg-base-100 p-2 shadow"
      >
        <div className=" p-4">
          {/*header*/}
          <div className="flex font-bold text-base-content">
            <div className="flex w-1/12 justify-center">Nummer</div>
            <div className="flex w-2/12 justify-center">Produkt</div>
            <div className="flex w-2/12 justify-center">Skylt</div>
            <div className="flex w-2/12 justify-center">Storlek</div>
            <div className="flex w-1/12 justify-center">Pris</div>
            <div className="flex w-2/12 justify-center">Antal</div>
            <div className="flex w-1/12 justify-center">Belopp</div>
            <div className="flex w-1/12 justify-center"></div>
          </div>
          <div className="max-h-96 flex-col space-y-2 overflow-y-scroll">
            {Object.entries(groupedItemsInCart).map(([key, items], index) => (
              <CartRow
                key={key}
                index={index}
                item={items[0]}
                quantity={items.length}
              />
            ))}
          </div>
          {/*checkout info and total*/}
          <div className="mt-4 flex flex-col items-end border-t-2 border-base-content text-base-content">
            <div className="mt-4 flex w-64 flex-col space-y-1">
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
            <div className="mt-4 flex w-full items-center justify-end space-x-2">
              <button onClick={handleCheckout} className="btn btn-info">
                Gå till kassan
                <FontAwesomeIcon
                  className="text-content-info ml-2 h-4 w-4"
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
