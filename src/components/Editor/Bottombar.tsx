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
import { getSignJSON, getSignMetadata } from "../../../reducers/signSlice";
import { Sign } from "../../types/sign.d";

interface Props {
  sign: Sign;
  addToCart: () => void;
  generateSVG: () => string;
  generateJPEG: () => string;
}

const Bottombar: React.FC<Props> = ({
  sign,
  addToCart,
  generateSVG,
  generateJPEG,
}) => {
  const { data: session } = useSession();
  console.log(session);

  const items = useSelector(selectCartItems);
  const router = useRouter();

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sign.JSON));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "download.json";
    a.click();
  };
  const handleDownloadSVG = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(generateSVG());
    const a = document.createElement("a");
    console.log(dataStr);
    a.href = dataStr;
    a.download = "download.svg";
    a.click();
  };

  const handleDownloadJPEG = () => {
    const a = document.createElement("a");
    a.href = generateJPEG();
    a.download = "download.jpeg";
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
    addToCart();
  };

  const handleSaveSign = () => {
    //dispatch(addCommand({ command: "saveSignToDatabase", value: session!.user!.email }));
  };

  return (
    <div className="fixed bottom-0 flex h-20 w-full flex-row items-center justify-between bg-base-200 px-4 ">
      <div className="flex space-x-4">
        <button
          className="primary-content btn-outline btn btn-primary"
          onClick={handleDownloadSVG}
        >
          <label>SVG</label>
        </button>
        <button
          className="primary-content btn-outline btn btn-primary"
          onClick={handleDownloadJPEG}
        >
          JPEG
        </button>
        <button
          className="primary-content btn-outline btn btn-primary"
          onClick={handleDownloadJSON}
        >
          JSON
        </button>

        {session && (
          <button className="btn btn-warning" onClick={handleSaveSign}>
            Spara skylt
          </button>
        )}
        {session?.account?.role === "admin" && (
          <button className="btn btn-warning" onClick={handleSaveSign}>
            test
          </button>
        )}
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="text-xl font-bold">{Math.round(sign.price)}</span> kr
        </div>

        {/*Add button */}
        <div>
          <button onClick={handleAddToCart} className="btn btn-warning">
            Lägg till i varukorg
            <FontAwesomeIcon className="ml-2 h-4 w-4" icon={faShoppingCart} />
          </button>
        </div>
        <div>
          <button onClick={handleCheckout} className="btn btn-info">
            Gå till kassan
            <FontAwesomeIcon className="ml-2 h-4 w-4" icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
