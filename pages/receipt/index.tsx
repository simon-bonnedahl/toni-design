import Head from "next/head";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";

function Home() {
  return (
    <div>
      <Head>
        <title>Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen h-screen">
        <HeaderBar />
        <Navbar />

        <h1>RECEIPT</h1>
      </main>
    </div>
  );
}
export default Home;
