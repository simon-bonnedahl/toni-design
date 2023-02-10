import type { NextPage } from "next";
import Head from "next/head";
import Editor from "../components/Editor/Editor";
import HeaderBar from "../components/HeaderBar";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col bg-base-100">
        <HeaderBar />
        <Navbar />

        <div className="flex max-h-[75%] flex-1">
          <Editor />
        </div>
      </main>
    </>
  );
};

export default Home;
