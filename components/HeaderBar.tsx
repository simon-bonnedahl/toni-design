import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBuyer, setBuyer } from "../reducers/cartSlice";
import ThemeSwitch from "./ThemeSwitch";
const HeaderBar: React.FC = () => {
  const [buyerState, setBuyerState] = useState(useSelector(selectBuyer));

  const handleBuyerChange = (b: string) => {
    setBuyerState(b);
    dispatch(setBuyer({ buyer: buyerState }));
  };
  const dispatch = useDispatch();
  return (
    <div className="flex justify-end items-center w-full h-8 bg-base-300 pl-12 pr-1 space-x-4 shadows-xl">
      {buyerState === "private" ? (
        <div className="base-content text-sm">
          <span
            onClick={() => handleBuyerChange("private")}
            className="font-bold hover:cursor-pointer base-content"
          >
            Privatperson
          </span>
          <span> / </span>
          <span
            onClick={() => handleBuyerChange("company")}
            className="hover:cursor-pointer"
          >
            Företag
          </span>
        </div>
      ) : (
        <div className="base-content text-sm">
          <span
            onClick={() => handleBuyerChange("private")}
            className="hover:cursor-pointer"
          >
            Privatperson
          </span>
          <span> / </span>
          <span
            onClick={() => handleBuyerChange("company")}
            className="font-bold hover:cursor-pointer"
          >
            Företag
          </span>
        </div>
      )}
      {typeof window !== "undefined" && <ThemeSwitch />}

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
