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
      var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        oc = document.createElement("canvas"),
        octx = oc.getContext("2d");

      canvas.width = 80; // cart Row height
      canvas.height = (canvas.width * img.height) / img.width;

      var cur = {
        width: Math.floor(img.width * 0.5),
        height: Math.floor(img.height * 0.5),
      };

      oc.width = cur.width;
      oc.height = cur.height;

      octx?.drawImage(img, 0, 0, cur.width, cur.height);

      while (cur.width * 0.5 > width) {
        cur = {
          width: Math.floor(cur.width * 0.5),
          height: Math.floor(cur.height * 0.5),
        };
        octx?.drawImage(
          oc,
          0,
          0,
          cur.width * 2,
          cur.height * 2,
          0,
          0,
          cur.width,
          cur.height
        );
      }

      ctx?.drawImage(
        oc,
        0,
        0,
        cur.width,
        cur.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

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
            price: price,
          },
          data: {
            pixelData: dataURL,
          },
          visual: {
            width: width,
            height: height,
          },
          price: price,
        };
      }

      dispatch(addToCart(item));
      console.log("item", item);
    };
    console.log(urlFor(image).url());
    img.src = urlFor(image).url();
  };
  return (
    <div className="card w-80 bg-base-300 shadow-xl">
      <figure className="px-10 h-64">
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
