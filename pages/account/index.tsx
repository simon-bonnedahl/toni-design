import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";

function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = () => {
    signOut();
  };

  return (
    <div>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen h-screen">
        <HeaderBar />
        <Navbar />
        <div>{session?.user?.name}</div>
        <button onClick={handleLogout} className="btn btn-warning w-40">
          Logga ut
        </button>
      </main>
    </div>
  );
}
export default Home;
