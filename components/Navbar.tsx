import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "../reducers/cartSlice";
import logo from "../public/toni-logo.png";

const Navbar: React.FC = () => {
  const items = useSelector(selectCartItems);

  return (
    <div className="flex justify-between items-center w-full h-20 pl-12 pr-1 bg-base-300">
      {/*Logo*/}

      {/*Shopping cart*/}
      <div className="flex space-x-2 ">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="w-6 h-6"
          color="#333"
        />
        <span>{items.length}</span>
      </div>
    </div>
  );
};

export default Navbar;
