import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBuyer, setBuyer } from "../reducers/shoppingcartSlice";
import ThemeSwitch from "./ThemeSwitch";
const HeaderBar: React.FC = () => {
  const [buyerState, setBuyerState] = useState(useSelector(selectBuyer));

  const handleBuyerChange = (b: string) => {
    setBuyerState(b);
    dispatch(setBuyer({ buyer: buyerState }));
  };
  const dispatch = useDispatch();
  return (
    <div className="flex justify-end items-center w-full h-8 bg-blue-400 pl-12 pr-1 space-x-4 shadows-xl">
      {buyerState === "private" ? (
        <div className="text-white text-sm">
          <span
            onClick={() => handleBuyerChange("private")}
            className="font-bold hover:cursor-pointer"
          >
            Private
          </span>
          <span> / </span>
          <span
            onClick={() => handleBuyerChange("company")}
            className="hover:cursor-pointer"
          >
            Company
          </span>
        </div>
      ) : (
        <div className="text-white text-sm">
          <span
            onClick={() => handleBuyerChange("private")}
            className="hover:cursor-pointer"
          >
            Private
          </span>
          <span> / </span>
          <span
            onClick={() => handleBuyerChange("company")}
            className="font-bold hover:cursor-pointer"
          >
            Company
          </span>
        </div>
      )}

      <ThemeSwitch />
      <div>
        <iframe
          className="w-20 h-5"
          src="https://ghbtns.com/github-btn.html?user=simon-bonnedahl&repo=toni-design&type=star&count=true&size=medium"
          title="GitHub"
        ></iframe>
      </div>
    </div>
  );
};

export default HeaderBar;
