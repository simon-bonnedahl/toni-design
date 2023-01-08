import { faPen, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import { addToCart } from "../reducers/cartSlice";
import { addCommand, clearCommands } from "../reducers/editorSlice";
import { setSign } from "../reducers/signSlice";
import { urlFor } from "../sanity";
interface Props {
  title: string;
  image: string;
  price: number;
  width: number;
  height: number;
  type: string;
  material: string;
  json: string;
}
const ProductCard: React.FC<Props> = ({
  title,
  image,
  price,
  width,
  height,
  type,
  material,
  json,
}) => {
  const [jsonObj, setJsonObj] = React.useState<any>({});
  const router = useRouter();
  const dispatch = useDispatch();

  let cardImage = urlFor(image).height(200).url();
  let cartImage = urlFor(image).height(100).url();

  const id = uuid();
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

  const handleAddToCart = () => {
    //make the image url to image data
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/jpeg");
      let item = null;
      if (jsonObj.visual) {
        item = {
          id: id,
          metadata: {
            ...jsonObj.metadata,
          },
          data: {
            ...jsonObj.data,
            pixelData: dataURL,
          },
          visual: {
            ...jsonObj.visual,
          },
          price: price,
        };
      } else {
        item = {
          id: id,
          metadata: {
            material: "",
            application: "",
            colorCombination: "",
            price: price,
            product: title,
          },
          data: {
            svg: "",
            pixelData: dataURL,
          },
          visual: {
            width: width,
            height: height,
          },
          price: price,
        };
      }

      document.getElementById("cart-button")?.focus();
      dispatch(addToCart(item));
    };
    img.src = cartImage;
  };
  return (
    <div className="card w-72 bg-base-300 shadow-xl">
      <figure className="px-10 h-48 mt-5">
        <img src={cardImage} alt="Product" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>
          {width} x {height} mm,
        </p>
        <p>{price} kr</p>

        <div className="card-actions">
          <div className="flex flex-col">
            {type == "adjustable" && (
              <button
                onClick={handleOpenSign}
                className="btn btn-success btn-outline mt-2 w-56"
              >
                Anpassa
                <FontAwesomeIcon
                  className="text-content-info ml-2"
                  icon={faPen}
                />
              </button>
            )}
            {type == "complete" && (
              <button
                onClick={handleAddToCart}
                className="btn btn-info btn-outline w-56"
              >
                Lägg till i varukorg
                <FontAwesomeIcon
                  className="text-content-info ml-2"
                  icon={faShoppingCart}
                />
              </button>
            )}
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
