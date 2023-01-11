import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import Cart from "./Cart";
import Searcher from "./Searcher";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <Link className="text-primary btn btn-ghost" href="/">
          Hem
        </Link>
        <Link className="text-primary btn btn-ghost" href="/collections">
          Sortiment
        </Link>
        <Link className="text-primary btn btn-ghost" href="/collections">
          Frågor & Svar
        </Link>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Toni-Design
        </Link>
      </div>

      <div className="navbar-end">
        <Searcher />
        <Cart />
        {session && <div>Inloggad som {session.user?.email}</div>}
        {!session && (
          <div onClick={() => signIn()} className="hover:cursor-pointer">
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
