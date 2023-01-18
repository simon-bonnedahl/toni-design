import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

function Home() {
  //copy infomation from cart and order then clear the cart
  return (
    <div>
      <Head>
        <title>Kvitto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-base-100">
        <div className="mt-40 flex h-3/6 w-6/12 flex-col items-center space-y-4 rounded-md border border-primary">
          <h1 className="mt-20 text-5xl">Tack för din beställning!</h1>
          <p>
            Din beställning förbereds och du kommer snart få en bekräftelse på
            mail.
          </p>
          <Link
            href="/"
            className="btn-success btn w-40 text-success-content hover:scale-110 "
          >
            Gå tillbaka
          </Link>
        </div>
      </main>
    </div>
  );
}
export default Home;
