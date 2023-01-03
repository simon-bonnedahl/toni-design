import { faPen, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { addCommand, clearCommands } from "../reducers/editorSlice";
import { setSign } from "../reducers/signSlice";
import { urlFor } from "../sanity";
interface Props {
  title: string;
  image: string;
  price: number;
  width: number;
  height: number;
  adjustable: boolean;
  material: string;
  json: string;
}
const ProductCard: React.FC<Props> = ({
  title,
  image,
  price,
  width,
  height,
  adjustable,
  material,
  json,
}) => {
  const [jsonObj, setJsonObj] = React.useState<any>({});
  const router = useRouter();
  const dispatch = useDispatch();

  if (json) {
    fetch(json).then((res) => {
      res.json().then((data) => {
        setJsonObj(data);
      });
    });
  }

  const handleOpenSign = () => {
    dispatch(clearCommands());
    dispatch(setSign({ sign: jsonObj }));
    dispatch(addCommand({ command: "reCreate", value: jsonObj.visual }));
    router.push("/");
  };

  const handleAddToCart = () => {};
  return (
    <div className="card w-80 bg-base-100 shadow-xl">
      <figure className="px-10 border h-64">
        <img src={urlFor(image).url()} alt="Product" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>
          {width} x {height} mm,
        </p>
        <p>{price} kr</p>

        <div className="card-actions">
          <div className="flex flex-col">
            <button
              onClick={handleAddToCart}
              className="btn btn-info btn-outline"
            >
              Lägg till i varukorg
              <FontAwesomeIcon
                className="text-content-info ml-2"
                icon={faShoppingCart}
              />
            </button>
            <button
              disabled={!adjustable}
              onClick={handleOpenSign}
              className="btn btn-success btn-outline mt-2"
            >
              Anpassa
              <FontAwesomeIcon
                className="text-content-info ml-2"
                icon={faPen}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

/*
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md">
      <div className="w-10/12 m-auto mt-4 h-40 bg-gray-100 rounded-md flex items-center justify-center ">
        <img className="p-20" src={urlFor(image).url()} alt="product image" />
      </div>
      <div className="p-10">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900">
          {title}
        </h5>
        <p>
          {width} x {height}{" "}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 ">{price} kr</span>
          <button className="text-white bg-blue-400 hover:scale-110 ease-in-out duration-300  font-medium rounded-lg text-sm p-3 text-center">
            Add to cart
          </button>
          {adjustable && (
            <button
              onClick={handleOpenSign}
              className="text-white bg-green-400 hover:scale-110 ease-in-out duration-300  font-medium rounded-lg text-sm p-3 text-center"
            >
              Adjust
            </button>
          )}
        </div>
      </div>
    </div>*/
