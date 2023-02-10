import {
  faArrowRight,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectCartItems } from "../../../reducers/cartSlice";
import { addCommand } from "../../../reducers/editorSlice";
import { getSignJSON, getSignMetadata } from "../../../reducers/signSlice";

const Bottombar: React.FC = () => {
  const price = useSelector(getSignMetadata).price;
  const json = useSelector(getSignJSON);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const items = useSelector(selectCartItems);
  const router = useRouter();

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "download.json";
    a.click();
  };

  const handleCheckout = async () => {
    if (items.length < 1) {
      toast.error("Kundvagnen är tom");
      return;
    }
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    document.getElementById("cart-button")?.focus();

    dispatch(addCommand({ command: "addToCart", value: 1 }));
  };

  const handleSaveSign = () => {
    dispatch(
      addCommand({ command: "saveSignToDatabase", value: session!.user!.email })
    );
  };

  return (
    <div className="fixed bottom-0 flex h-20 w-full flex-row items-center justify-between bg-base-200 px-4 ">
      <div className="flex space-x-4">
        <button
          className="primary-content btn-outline btn-primary btn"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "SVG" }))
          }
        >
          <label>SVG</label>
        </button>
        <button
          className="primary-content btn-outline btn-primary btn"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "PDF" }))
          }
        >
          JPEG
        </button>
        <button
          className="primary-content btn-outline btn-primary btn"
          onClick={handleDownloadJSON}
        >
          JSON
        </button>

        {session && (
          <button className="btn-warning btn" onClick={handleSaveSign}>
            Spara skylt
          </button>
        )}
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="text-xl font-bold">{Math.round(price)}</span> kr
        </div>

        {/*Add button */}
        <div>
          <button onClick={handleAddToCart} className="btn-info btn">
            Lägg till i varukorg
            <FontAwesomeIcon className="ml-2 h-4 w-4" icon={faShoppingCart} />
          </button>
        </div>
        <div>
          <button onClick={handleCheckout} className="btn-success btn">
            Gå till kassan
            <FontAwesomeIcon className="ml-2 h-4 w-4" icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
