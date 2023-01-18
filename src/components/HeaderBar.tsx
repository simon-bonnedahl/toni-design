import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomer, setCustomer } from "../../reducers/cartSlice";
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

  return (
    <div className="shadows-xl flex h-8 w-full items-center justify-end space-x-4 bg-base-300 pl-12 pr-1">
      {customerState === "private" ? (
        <div className="base-content text-sm">
          <span
            onClick={() => handleCustomerChange("private")}
            className="base-content font-bold hover:cursor-pointer"
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

      <div>
        <iframe
          className="h-5 w-20"
          src="https://ghbtns.com/github-btn.html?user=simon-bonnedahl&repo=toni-design&type=star&count=true&size=medium"
          title="GitHub"
        ></iframe>
      </div>
    </div>
  );
};

export default HeaderBar;
