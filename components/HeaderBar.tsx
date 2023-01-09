import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomer, setCustomer } from "../reducers/cartSlice";
import ThemeSwitch from "./ThemeSwitch";
const HeaderBar: React.FC = () => {
  const customer = useSelector(selectCustomer);
  const [customerState, setCustomerState] = useState(customer);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const handleCustomerChange = (c: string) => {
    setCustomerState(c);
    dispatch(setCustomer({ customer: c }));
  };
  const dispatch = useDispatch();
  useEffect(() => {
    setWindowLoaded(true);
    setCustomerState(customer);
  }, [customer]);

  const [themeIndex, setThemeIndex] = useState(0);

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  const handleNextTheme = () => {
    setThemeIndex((themeIndex + 1) % themes.length);
    console.log(themes[themeIndex]);
    document
      .querySelector("body")
      ?.setAttribute("data-theme", themes[themeIndex]);
  };

  return (
    <div className="flex justify-end items-center w-full h-8 bg-base-300 pl-12 pr-1 space-x-4 shadows-xl">
      {customerState === "private" ? (
        <div className="base-content text-sm">
          <span
            onClick={() => handleCustomerChange("private")}
            className="font-bold hover:cursor-pointer base-content"
          >
            Privatperson
          </span>
          <span> / </span>
          <span
            onClick={() => handleCustomerChange("company")}
            className="hover:cursor-pointer"
          >
            Företag
          </span>
        </div>
      ) : (
        <div className="base-content text-sm">
          <span
            onClick={() => handleCustomerChange("private")}
            className="hover:cursor-pointer"
          >
            Privatperson
          </span>
          <span> / </span>
          <span
            onClick={() => handleCustomerChange("company")}
            className="font-bold hover:cursor-pointer"
          >
            Företag
          </span>
        </div>
      )}
      {windowLoaded && <ThemeSwitch />}
      <button onClick={handleNextTheme}>Next theme</button>
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
