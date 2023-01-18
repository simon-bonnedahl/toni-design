import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";

import {
  faArrowRightFromBracket,
  faBoxArchive,
  faClockRotateLeft,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Details from "./details";
import OrderHistory from "./orderHistory";
import Saved from "./saved";
import Settings from "./settings";

function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedSection, setSelectedSection] = useState("saved");

  const handleLogout = () => {
    signOut();
  };

  const handleShowSaved = () => {
    setSelectedSection("saved");
  };

  const handleShowDetails = () => {
    setSelectedSection("details");
  };

  const handleShowOrders = () => {
    setSelectedSection("orderHistory");
  };
  const handleShowSettings = () => {
    setSelectedSection("settings");
  };

  const menuItems = [
    {
      title: "Sparade skyltar",
      icon: faBoxArchive,
      func: handleShowSaved,
    },
    { title: "Mina uppgifter", icon: faUser, func: handleShowDetails },
    { title: "Orderhistorik", icon: faClockRotateLeft, func: handleShowOrders },
    { title: "Inställningar", icon: faGear, func: handleShowSettings },
    { title: "Logga ut", icon: faArrowRightFromBracket, func: handleLogout },
  ];

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  return (
    <div>
      <Head>
        <title>Konto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-screen flex-col bg-base-100">
        <HeaderBar />
        <Navbar />
        <div className="flex h-screen space-x-10 px-40 pt-10">
          <ul className="menu rounded-box h-min w-96 space-y-2 bg-base-200 p-2">
            <li className="px-4 pt-2 text-xl">Hej {session?.user?.name}</li>
            {menuItems.map((item, key) => (
              <li key={key}>
                <a onClick={item.func}>
                  <FontAwesomeIcon icon={item.icon} />
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          {selectedSection === "saved" && <Saved />}
          {selectedSection === "details" && <Details />}
          {selectedSection === "orderHistory" && <OrderHistory />}
          {selectedSection === "settings" && <Settings />}
        </div>
        <Footer />
      </main>
    </div>
  );
}
export default Home;
