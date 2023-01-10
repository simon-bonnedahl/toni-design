import { useEffect, useState } from "react";
import Head from "next/head";
import client from "../../sanity";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import ResultFeed from "../../components/ResultFeed";
import SideNav from "../../components/SideNav";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { getSelectedCategory } from "../../reducers/navigationSlice";

function Home() {
  const [products, setProducts] = useState<any[]>([]);

  const selectedCategory = useSelector(getSelectedCategory);
  const [currentCategory, setCurrentCategory] = useState<any>(selectedCategory);

  useEffect(() => {
    //https://www.sanity.io/docs/js-client
    //const query = '*[_type == "bike" && seats >= $minSeats] {name, seats}'
    let query = `*[_type == 'product' && '${selectedCategory}' in categories[]->title] {
                                ...,
            "jsonURL": json.asset->url
      }`;

    if (selectedCategory === null) {
      query = `*[_type == 'product'] {
          ...,
              "jsonURL": json.asset->url
        }
        `;
    }

    client.fetch(query).then((data: any) => {
      setProducts(data);
    });
    setCurrentCategory(selectedCategory);
  }, [selectedCategory]);
  return (
    <div>
      <Head>
        <title>Sortiment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex">
          <SideNav />
          <div className="flex flex-col p-4">
            <h1>{currentCategory}</h1>
            <ResultFeed products={products} />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
export default Home;
