import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Bottombar from "../components/Bottombar";
import Canvas from "../components/Canvas";
import Editor from "../components/Editor/Editor";
import HeaderBar from "../components/HeaderBar";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const { data: session } = useSession();

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
        <Bottombar />
      </main>
    </>
  );
};

export default Home;
