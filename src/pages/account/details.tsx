import { useQuery } from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userRouter } from "../../server/trpc/router/user";
import { SignUpDetails, signUpDetails } from "../../types/auth";
import countriesEurope from "../../utils/countriesEurope";
import { trpc } from "../../utils/trpc";

const Details = () => {
  const { data: session } = useSession();
  //fetch the user data from the database
  const { data, isLoading, isError } = trpc.user.getUserDetails.useQuery({
    email: session?.user?.email || "",
  });

  const [userDetails, setUserDetails] = useState<SignUpDetails>({
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

  useEffect(() => {
    if (data) {
      setUserDetails({
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        address: data.phone,
        zipCode: data.zipCode,
        country: data.country,
        city: data.city,
      });
    }
  }, [data]);

  const handleUpdateDetails = async () => {
    const updates = trpc.user.updateUserDetails.useMutation();
    await updates.mutateAsync(userDetails, {
      onSuccess: () => {
        toast.success("Uppgifter uppdaterade!", {
          autoClose: 2000,
        });
      },
      onError: (error) => {
        if (error.message.includes("[")) {
          const parsedError = JSON.parse(error.message);
          parsedError.forEach((err: TRPCError) => {
            toast.error(err.message, {
              autoClose: 2000,
            });
          });
        } else {
          toast.error(error.message, {
            autoClose: 2000,
          });
        }
      },
    });
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold">Mina uppgifter</h1>
      <form
        onSubmit={handleUpdateDetails}
        className="flex w-full flex-col gap-4"
      >
        <div className="text-md flex flex-col">
          <label htmlFor="email">E-post</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="email"
            name="email"
            id="email"
            value={userDetails.email}
            onChange={(e) => {
              setUserDetails({ ...userDetails, email: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="firstname">Förnamn</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="text"
            name="firstname"
            id="firstname"
            value={userDetails.firstname}
            onChange={(e) => {
              setUserDetails({ ...userDetails, firstname: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastname">Efternamn</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="text"
            name="lastname"
            id="lastname"
            value={userDetails.lastname}
            onChange={(e) => {
              setUserDetails({ ...userDetails, lastname: e.target.value });
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
            value={userDetails.password}
            onChange={(e) => {
              setUserDetails({ ...userDetails, password: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone">Telefon</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="phone"
            name="phone"
            id="phone"
            value={userDetails.phone}
            onChange={(e) => {
              setUserDetails({ ...userDetails, phone: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address">Adress</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="address"
            name="address"
            id="address"
            value={userDetails.address}
            onChange={(e) => {
              setUserDetails({ ...userDetails, address: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="zipCode">Postnummer</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="zipCode"
            name="zipCode"
            id="zipCode"
            value={userDetails.zipCode}
            onChange={(e) => {
              setUserDetails({ ...userDetails, zipCode: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="city">Stad</label>
          <input
            className="max-w input-bordered input-primary input w-full"
            type="city"
            name="city"
            id="city"
            value={userDetails.city}
            onChange={(e) => {
              setUserDetails({ ...userDetails, city: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Land</label>
          <select
            className="select-bordered select w-full max-w-xs border-primary"
            onChange={(e) =>
              setUserDetails({ ...userDetails, country: e.target.value })
            }
          >
            {countriesEurope.map((c) => {
              if (c === userDetails.country)
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
          Uppdatera
        </button>
      </form>
    </div>
  );
};

export default Details;
