import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

function Home() {
  //copy infomation from cart and order then clear the cart
  useEffect(() => {}, []);
  return (
    <div>
      <Head>
        <title>Kvitto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center bg-base-100 w-screen h-screen">
        <div className="flex flex-col space-y-4 items-center w-6/12 h-3/6 mt-40 border border-primary rounded-md">
          <h1 className="text-5xl mt-20">Tack för din beställning!</h1>
          <p>
            Din beställning förbereds och du kommer snart få en bekräftelse på
            mail.
          </p>
          <Link
            href="/"
            className="btn btn-success text-success-content w-40 hover:scale-110 "
          >
            Gå tillbaka
          </Link>
        </div>
      </main>
    </div>
  );
}
export default Home;
