import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Cart from "./Cart";
import Searcher from "./Searcher";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start flex space-x-4 pl-5">
        <Link className="" href="/">
          <img className="logo" />
        </Link>
        <Link
          className="btn btn-ghost font-bold text-base-content "
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
          <div>
            <Link href="/auth" className="btn btn-ghost">
              <div className="flex space-x-2">
                <FontAwesomeIcon icon={faUser} />
                <span>Logga in</span>
              </div>
            </Link>
          </div>
        )}

        <Searcher />
      </div>
      <Cart />
    </div>
  );
};

export default Navbar;
