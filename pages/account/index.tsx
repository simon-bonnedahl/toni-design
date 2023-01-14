import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";

import {
  faArrowRightFromBracket,
  faClockRotateLeft,
  faL,
  faM,
  faO,
  faU,
  faUser,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Creations from "./creations";
import Details from "./details";
import OrderHistory from "./orderHistory";

function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedSection, setSelectedSection] = useState("creations");

  const handleLogout = () => {
    signOut();
  };

  const handleShowCreations = () => {
    setSelectedSection("creations");
  };

  const handleShowDetails = () => {
    setSelectedSection("details");
  };

  const handleShowOrders = () => {
    setSelectedSection("orderHistory");
  };

  const menuItems = [
    {
      title: "Mina skapelser",
      icon: faWindowRestore,
      func: handleShowCreations,
    },
    { title: "Mina uppgifter", icon: faUser, func: handleShowDetails },
    { title: "Orderhistorik", icon: faClockRotateLeft, func: handleShowOrders },
    { title: "Logga ut", icon: faArrowRightFromBracket, func: handleLogout },
  ];

  return (
    <div>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex px-40 pt-10 h-screen space-x-10">
          <ul className="menu bg-base-200 w-96 p-2 h-min rounded-box space-y-2">
            <li className="text-xl px-4 pt-2">Hej {session?.user?.name}</li>
            {menuItems.map((item) => (
              <li>
                <a onClick={item.func}>
                  <FontAwesomeIcon icon={item.icon} />
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          {selectedSection === "creations" && <Creations />}
          {selectedSection === "details" && <Details />}
          {selectedSection === "orderHistory" && <OrderHistory />}
        </div>
        <Footer />
      </main>
    </div>
  );
}
export default Home;
