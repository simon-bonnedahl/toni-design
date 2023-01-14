import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
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

  return (
    <div>
      <Head>
        <title>Konto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex px-40 pt-10 h-screen space-x-10">
          <ul className="menu bg-base-200 w-96 p-2 h-min rounded-box space-y-2">
            <li className="text-xl px-4 pt-2">Hej {session?.user?.name}</li>
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
