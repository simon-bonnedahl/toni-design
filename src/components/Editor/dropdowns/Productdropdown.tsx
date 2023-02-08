import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../../../reducers/editorSlice";
import {
  getSignMetadata,
  setSignProduct,
} from "../../../../reducers/signSlice";

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
  ];
  const dispatch = useDispatch();

  const handleProductChange = (p: string) => {
    setSelectedProduct(p);
    dispatch(setSignProduct({ product: p }));
  };

  return (
    <div className="dropdown">
      <label
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        tabIndex={0}
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Produkt</p>
        <FontAwesomeIcon icon={faChevronDown} className="scale-110" />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-96 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Välj en produkt</h3>
          <div className="flex flex-col space-y-4">
            {products.map((product) => {
              let className =
                "flex justify-between hover:cursor-pointer h-24 relative";
              if (product.name === selectedProduct)
                className += " border border-primary rounded-md";

              return (
                <div
                  key={product.key}
                  className={className}
                  onClick={() => handleProductChange(product.name)}
                >
                  <div className="flex flex-col justify-center p-2">
                    <h1 className="text-neutral-content">{product.swe}</h1>
                    <p className="text-xs text-neutral-content">
                      {product.desc}
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer"></label>
                  </div>
                  <div className="form-control">
                    <label className="label absolute bottom-0 right-0 cursor-pointer">
                      <span className="label-text text-neutral-content">
                        Vald
                      </span>
                      <input
                        readOnly
                        type="radio"
                        name="radio-product"
                        checked={product.name === selectedProduct}
                        className="radio ml-2 checked:border-base-100 checked:bg-primary"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-neutral-content">Kommer fler senare</p>
        </div>
      </div>
    </div>
  );
};

export default Productdropdown;
