import { faPen, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import { addToCart } from "../../../reducers/cartSlice";
import { addCommand, clearCommands } from "../../../reducers/editorSlice";
import { getSelectedProduct } from "../../../reducers/navigationSlice";
import { setSign } from "../../../reducers/signSlice";
import client, { urlFor } from "../../../sanity";

function Home() {
  const selectedProduct = useSelector(getSelectedProduct);
  const [product, setProduct] = useState<any>();
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    //fetch the product from sanity with the id from selectedProduct
    const { id } = router.query;
    console.log(id);

    const query = `*[_type == 'product' && _id == '${id}']{
        ...,
        
        "image": image.asset->url,
        "json": json.asset->url,
    }[0]`;

    client.fetch(query).then((data: any) => {
      setProduct(data);
      if (data.json) {
        fetch(data.json).then((res) => {
          res.json().then((json) => {
            setProduct({ ...data, json: json });
          });
        });
      }
    });
  }, [selectedProduct]);

  const handleOpenSign = () => {
    console.log(product);
    dispatch(clearCommands());
    dispatch(setSign({ sign: product.json }));
    dispatch(addCommand({ command: "reCreate", value: product.json.visual }));
    router.push("/");
  };

  const handleAddToCart = () => {
    //make the image url to image data
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/jpeg");
      let item = null;
      if (product.visual) {
        item = {
          id: product.id,
          metadata: {
            ...product.metadata,
          },
          data: {
            ...product.data,
            pixelData: dataURL,
          },
          visual: {
            ...product.visual,
          },
          price: product.price,
        };
      } else {
        item = {
          id: product.id,
          metadata: {
            material: "",
            application: "",
            colorCombination: "",
            price: product.price,
            product: product.title,
          },
          data: {
            svg: "",
            pixelData: dataURL,
          },
          visual: {
            width: product.width,
            height: product.height,
          },
          price: product.price,
        };
      }

      document.getElementById("cart-button")?.focus();
      dispatch(addToCart(item));
    };
    const cartImage = urlFor(product.image).height(80).url();
    img.src = cartImage;
  };
  if (!product) {
    return null;
  }
  return (
    <div>
      <Head>
        <title>Produkt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col bg-base-100">
        <HeaderBar />
        <Navbar />
        <div className="flex space-x-10 px-64 pt-12">
          {/* Image and product info*/}
          <div className="flex w-1/2 flex-col items-center">
            {/*Image*/}
            <div className="flex h-96 w-full items-center justify-center rounded-md border border-neutral bg-base-200">
              {product.image && (
                <NextImage
                  src={urlFor(product.image).width(400).height(300).url()}
                  alt="Product image"
                  width={400}
                  height={300}
                />
              )}
            </div>
          </div>
          {/*Title, description, price and buttons*/}
          <div className="flex w-1/2 flex-col">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p>
              {product.width} x {product.height} mm,
            </p>
            <p>{product.price} kr</p>
            {product.productType == "adjustable" && (
              <button
                onClick={handleOpenSign}
                className="btn-warning btn mt-2 w-96"
              >
                Anpassa
                <FontAwesomeIcon
                  className="text-content-info ml-2"
                  icon={faPen}
                />
              </button>
            )}

            {product.productType == "complete" && (
              <button onClick={handleAddToCart} className="btn-info btn  w-96">
                Lägg till i varukorg
                <FontAwesomeIcon
                  className="text-content-info ml-2"
                  icon={faShoppingCart}
                />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
export default Home;
