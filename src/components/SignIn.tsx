import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { SignInDetails } from "../types/auth";

enum AUTH {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

const SignIn = ({ setAuth }: { setAuth: Dispatch<SetStateAction<AUTH>> }) => {
  const { data } = useSession();

  const [signInDetails, setSignInDetails] = useState<SignInDetails>({
    email: "",
    password: "",
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", {
            email: signInDetails.email,
            password: signInDetails.password,
            redirect: false,
          }).then((res) => {
            res?.error
              ? toast(res?.error, {
                  type: "error",
                  autoClose: 2000,
                })
              : toast("Inloggningen lyckades", {
                  type: "success",
                  autoClose: 1000,
                }) &&
                setTimeout(() => {
                  window.location.href = "/";
                }, 1000);
          });
        }}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col">
          <label htmlFor="password">E-post</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="email"
            name="email"
            id="email"
            value={signInDetails.email}
            onChange={(e) => {
              setSignInDetails({ ...signInDetails, email: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Lösenord</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="password"
            name="password"
            id="password"
            value={signInDetails.password}
            onChange={(e) => {
              setSignInDetails({ ...signInDetails, password: e.target.value });
            }}
          />
        </div>
        <button
          disabled={data ? true : false}
          type="submit"
          className="btn-info btn flex gap-2"
        >
          <FontAwesomeIcon className="scale-110" icon={faRightToBracket} />
          Logga in
        </button>
      </form>
      <div className="flex w-full flex-col">
        <button
          onClick={() => setAuth(AUTH.SIGN_UP)}
          className="btn-outline btn"
        >
          Skapa konto
        </button>
      </div>
      <div className="flex w-full justify-end">
        <span className="link">Glömt lösenord?</span>
      </div>
    </div>
  );
};

export default SignIn;
