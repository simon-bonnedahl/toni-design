import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Cart from "./Cart";
import Searcher from "./Searcher";
import logolight from "../static/logo-light-2.png";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start flex space-x-4 pl-5">
        <Link className="" href="/">
          <Image
            className="text-black"
            src={logolight}
            alt="logo"
            height={150}
            width={150}
          />
        </Link>
        <Link
          className="text-base-content btn btn-ghost font-bold "
          href="/collections"
        >
          <div className="flex space-x-2">
            <FontAwesomeIcon className="scale-110" icon={faWindowRestore} />
            <span>Sortiment</span>
          </div>
        </Link>
      </div>

      <div className="navbar-end">
        {session && (
          <Link href="/account" className="btn btn-ghost">
            <div className="flex space-x-2">
              <FontAwesomeIcon icon={faUser} />
              <span>Mitt konto</span>
            </div>
          </Link>
        )}
        {!session && (
          <button onClick={() => signIn()} className="btn btn-ghost">
            <div className="flex space-x-2">
              <FontAwesomeIcon icon={faUser} />
              <span>Logga in</span>
            </div>
          </button>
        )}
        <Searcher />
      </div>
      <Cart />
    </div>
  );
};

export default Navbar;
