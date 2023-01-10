import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import { getSelectedProduct } from "../../reducers/navigationSlice";
import client, { urlFor } from "../../sanity";

function Home() {
  const selectedProduct = useSelector(getSelectedProduct);
  const [productTitle, setProductTitle] = useState<string>();
  const [productImage, setProductImage] = useState<string>();

  useEffect(() => {
    //fetch the product from sanity with the id from selectedProduct
    console.log(selectedProduct);
    let query = `*[_type == 'product' && _id == '${selectedProduct}']{
        ...,
        
        "imageUrl": image.asset->url
    }[0]`;

    client.fetch(query).then((data: any) => {
      console.log(data);
      setProductTitle(data.title);
      setProductImage(data.imageUrl);
    });
  }, [selectedProduct]);

  return (
    <div>
      <Head>
        <title>Produkt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen h-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex">
          {/* Image and product info*/}
          <div className="flex flex-col w-1/2 items-center">
            {/*Image*/}
            <div className="w-96 h-96 border border-neutral rounded-md p-4">
              {productImage && <img src={urlFor(productImage).url()}></img>}
            </div>
          </div>
          {/*Title, description, price and buttons*/}
          <div className="flex flex-col w-1/2 items-center">
            <h1>{productTitle}</h1>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Home;
