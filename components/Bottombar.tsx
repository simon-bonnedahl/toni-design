import {
  faArrowRight,
  faMinus,
  faPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, setShowModal } from "../reducers/cartSlice";
import { addCommand } from "../reducers/editorSlice";
import { getSignJSON, getSignMetadata } from "../reducers/signSlice";

const Bottombar: React.FC = () => {
  const price = useSelector(getSignMetadata).price;
  const json = useSelector(getSignJSON);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);

  const items = useSelector(selectCartItems);

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

  const handleAddToCart = () => {
    dispatch(addCommand({ command: "addToCart", value: amount }));
  };

  return (
    <div className="flex flex-row w-full h-20 items-center bg-base-300 justify-between px-4 ">
      <div className="flex space-x-4">
        <button
          className="btn btn-primary primary-content"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "SVG" }))
          }
        >
          <label>Download SVG</label>
        </button>
        <button
          className="btn btn-primary primary-content"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "PDF" }))
          }
        >
          Download PDF
        </button>
        <button
          className="btn btn-primary primary-content"
          onClick={handleDownloadJSON}
        >
          Download JSON
        </button>
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="font-bold text-xl">{Math.round(price)}</span> kr
        </div>
        {/*Increase and Decrease
        
        
        <div className="flex items-center rounded-md">
          <button
            disabled={amount === 0}
            onClick={() => setAmount(amount - 1)}
            className="btn"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faMinus} />
          </button>
          <div className="p-4">
            <span className="font-bold">{amount}</span>
          </div>
          <button onClick={() => setAmount(amount + 1)} className="btn">
            <FontAwesomeIcon className="w-3 h-3" icon={faPlus} />
          </button>
        </div>
        */}

        {/*Add button */}
        <div>
          <button
            onClick={handleAddToCart}
            className="btn btn-info btn-outline"
          >
            Lägg till i varukorg
            <FontAwesomeIcon
              className="w-4 h-4 text-content-info ml-2"
              icon={faShoppingCart}
            />
          </button>
        </div>
        <div>
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
  );
};

export default Bottombar;
