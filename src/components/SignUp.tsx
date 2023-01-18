import React, { Dispatch, SetStateAction, useState } from "react";
import { TRPCError } from "../types/app";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import countriesEurope from "../utils/countriesEurope";
import { SignUpDetails } from "../types/auth";

enum AUTH {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

const SignUp = ({ setAuth }: { setAuth: Dispatch<SetStateAction<AUTH>> }) => {
  const user = trpc.user.signUp.useMutation();
  const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    zipCode: "",
    country: "",
    city: "",
  });

  const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await user.mutateAsync(
      {
        email: signUpDetails.email,
        password: signUpDetails.password,
        firstname: signUpDetails.firstname,
        lastname: signUpDetails.lastname,
        phone: signUpDetails.phone,
        address: signUpDetails.address,
        zipCode: signUpDetails.zipCode,
        country: signUpDetails.country,
        city: signUpDetails.city,
      },
      {
        onSuccess: async () => {
          toast.success("Konto skapat!", {
            autoClose: 2000,
          });
          await signIn("credentials", {
            email: signUpDetails.email,
            password: signUpDetails.password,
            redirect: false,
          }).then(() =>
            setTimeout(() => {
              window.location.href = "/auth";
            }, 2000)
          );
        },
        onError: (error) => {
          if (error.message.includes("[")) {
            const parsedError = JSON.parse(error.message);
            parsedError.forEach((err: TRPCError) => {
              toast(err.message, {
                type: "error",
                autoClose: 2000,
              });
            });
          } else {
            toast(error.message, {
              type: "error",
              autoClose: 2000,
            });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={signUpHandler} className="flex w-full flex-col gap-4">
      <div className="flex flex-col">
        <label htmlFor="email">
          E-post <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="email"
          name="email"
          id="email"
          value={signUpDetails.email}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, email: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="firstname">
          Förnamn <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="text"
          name="firstname"
          id="firstname"
          value={signUpDetails.firstname}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, firstname: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="lastname">
          Efternamn <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="text"
          name="lastname"
          id="lastname"
          value={signUpDetails.lastname}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, lastname: e.target.value });
          }}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password">
          Lösenord <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="password"
          name="password"
          id="password"
          value={signUpDetails.password}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, password: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="phone">
          Telefon <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="phone"
          name="phone"
          id="phone"
          value={signUpDetails.phone}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, phone: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="address">
          Adress <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="address"
          name="address"
          id="address"
          value={signUpDetails.address}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, address: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="zipCode">
          Postnummer <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="zipCode"
          name="zipCode"
          id="zipCode"
          value={signUpDetails.zipCode}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, zipCode: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="city">
          Stad <span className="text-red-600">*</span>
        </label>
        <input
          className="max-w input-bordered input-primary input w-full"
          type="city"
          name="city"
          id="city"
          value={signUpDetails.city}
          onChange={(e) => {
            setSignUpDetails({ ...signUpDetails, city: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label>
          Land <span className="text-red-600">*</span>
        </label>
        <select className="select-bordered select w-full max-w-xs border-primary">
          {countriesEurope.map((c) => {
            if (c === signUpDetails.country)
              return (
                <option key={c} selected>
                  {c}
                </option>
              );
            else return <option key={c}>{c}</option>;
          })}
        </select>
      </div>

      <button type="submit" className="btn-info btn">
        Registrera
      </button>
      <button
        onClick={() => setAuth(AUTH.SIGN_IN)}
        type="submit"
        className="btn-ghost btn"
      >
        Har du redan ett konto? Logga in här!
      </button>
    </form>
  );
};
export default SignUp;
