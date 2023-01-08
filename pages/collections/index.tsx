import React, { useEffect, useState } from "react";
import Head from "next/head";
import client from "../../sanity";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import ResultFeed from "../../components/ResultFeed";
import SideNav from "../../components/SideNav";
import Footer from "../../components/Footer";

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
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex">
          <SideNav />
          <ResultFeed products={products} />
        </div>
        <Footer />
      </main>
    </div>
  );
}
export default Home;
