import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Cart from "./Cart";
import Searcher from "./Searcher";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start flex space-x-4 pl-5">
        <Link className="" href="/">
          <Image
            src="/../public/logo-light-2.png"
            alt="logo"
            height={150}
            width={150}
          />
        </Link>
        <Link
          className="text-base-content btn btn-ghost font-bold"
          href="/collections"
        >
          Sortiment
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
