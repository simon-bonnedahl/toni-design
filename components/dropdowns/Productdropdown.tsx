import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import {
  getSignMetadata,
  getSignVisual,
  setSignProduct,
} from "../../reducers/signSlice";

const Productdropdown: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(
    useSelector(getSignMetadata).product
  );

  //Hämta från sanity
  const products = [
    {
      name: "Engraved Sign",
      key: 0,
      swe: "Graverad skylt",
      desc: "Graverade skyltar är bra för att visa upp information",
    },
    {
      name: "Named Sign",
      key: 1,
      swe: "Namnskylt",
      desc: "Namnskyltar är bra för att visa upp information",
    },
  ];
  const dispatch = useDispatch();

  const handleProductChange = (p: string) => {
    setSelectedProduct(p);
    dispatch(setSignProduct({ product: p }));
  };

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn btn-primary m-1 flex space-x-2 btn-outline"
      >
        <p className="text-content-primary">Produkt</p>
        <FontAwesomeIcon icon={faChevronDown} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-96 card-compact bg-neutral p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Välj en produkt</h3>
          <div className="flex flex-col space-y-4">
            {products.map((product) => {
              let className =
                "flex justify-between hover:cursor-pointer h-24 relative";
              if (product.name === selectedProduct) className += " bg-primary";
              else className += " bg-neutral";

              return (
                <div
                  key={product.key}
                  className={className}
                  onClick={() => handleProductChange(product.name)}
                >
                  <div className="p-2 flex flex-col justify-center">
                    <h1 className="text-neutral-content">{product.swe}</h1>
                    <p className="text-neutral-content text-xs">
                      {product.desc}
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer"></label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer absolute bottom-0 right-0">
                      <span className="label-text">Vald</span>
                      <input
                        readOnly
                        type="radio"
                        name="radio-10"
                        checked={product.name === selectedProduct}
                        className="radio checked:bg-primary checked:border-base-100 ml-2"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdropdown;
