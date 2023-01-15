import {
  faArrowRight,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../reducers/alertSlice";
import { selectCartItems } from "../reducers/cartSlice";
import { addCommand } from "../reducers/editorSlice";
import { getSignJSON, getSignMetadata } from "../reducers/signSlice";

const Bottombar: React.FC = () => {
  const price = useSelector(getSignMetadata).price;
  const json = useSelector(getSignJSON);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const items = useSelector(selectCartItems);
  const router = useRouter();

  const handleDownloadJSON = () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    var a = document.createElement("a");
    a.href = dataStr;
    a.download = "download.json";
    a.click();
  };

  const handleCheckout = async () => {
    if (items.length < 1) {
      dispatch(setError("Du har inget i din varukorg"));
    } else {
      dispatch(setError(""));
      router.push("/checkout");
    }
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
    <div className="fixed bottom-0 flex flex-row w-full h-20 items-center bg-base-200 justify-between px-4 ">
      <div className="flex space-x-4">
        <button
          className="btn btn-primary primary-content btn-outline"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "SVG" }))
          }
        >
          <label>SVG</label>
        </button>
        <button
          className="btn btn-primary primary-content btn-outline"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "PDF" }))
          }
        >
          JPEG
        </button>
        <button
          className="btn btn-primary btn-outline primary-content"
          onClick={handleDownloadJSON}
        >
          JSON
        </button>
        {session && (
          <button className="btn btn-warning" onClick={handleSaveSign}>
            Spara skylt
          </button>
        )}
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="font-bold text-xl">{Math.round(price)}</span> kr
        </div>

        {/*Add button */}
        <div>
          <button onClick={handleAddToCart} className="btn btn-info">
            Lägg till i varukorg
            <FontAwesomeIcon className="w-4 h-4 ml-2" icon={faShoppingCart} />
          </button>
        </div>
        <div>
          <button onClick={handleCheckout} className="btn btn-success">
            Gå till kassan
            <FontAwesomeIcon className="w-4 h-4 ml-2" icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
