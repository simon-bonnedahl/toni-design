import React, { useEffect, useState } from "react";
import Head from "next/head";
import client from "../../sanity";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    //https://www.sanity.io/docs/js-client
    //const query = '*[_type == "bike" && seats >= $minSeats] {name, seats}'
    const query = `*[_type == 'product'] {
                                ...,
            "jsonURL": json.asset->url
      }`;
    const params = {};

    client.fetch(query, params).then((data: any) => {
      setProducts(data);
    });
  }, []);
  return (
    <div>
      <Head>
        <title>Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen h-screen">
        <HeaderBar />
        <Navbar />
        <div className="grid grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              image={product.image}
              price={product.price}
              width={product.width}
              height={product.height}
              adjustable={product.adjustable}
              material={product.material}
              json={product.jsonURL}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
export default Home;
