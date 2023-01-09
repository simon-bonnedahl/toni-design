import Head from "next/head";
import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";
import Canvas from "../components/Canvas";
import Navbar from "../components/Navbar";
import HeaderBar from "../components/HeaderBar";

function Home() {
  return (
    <div>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen h-screen">
        <HeaderBar />
        <Navbar />
        <Topbar />
        {/*Middel section*/}
        <div className="flex flex-1 max-h-[75%]">
          <Canvas />
        </div>
        <Bottombar />
      </main>
    </div>
  );
}
export default Home;
