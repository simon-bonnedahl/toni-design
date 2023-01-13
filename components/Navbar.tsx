import { signOut, useSession } from "next-auth/react";
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
        <Searcher />
        <Cart />
        {session && <div>Inloggad som {session.user?.name}</div>}
        {!session && (
          <div
            onClick={() => router.push("/login")}
            className="hover:cursor-pointer"
          >
            Logga in
          </div>
        )}
      </div>

      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="https://placeimg.com/80/80/people" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          {session && (
            <li>
              <a onClick={() => signOut()}>Logout</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
