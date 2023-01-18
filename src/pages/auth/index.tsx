import { useState } from "react";
import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import Head from "next/head";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

enum AUTH {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

const Auth = () => {
  const [auth, setAuth] = useState<AUTH>(AUTH.SIGN_IN);

  return (
    <div>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-screen flex-col bg-base-100">
        <HeaderBar />
        <Navbar />
        <div className="mx-10 mt-10 flex justify-center space-x-10 ">
          {/*Form*/}
          {/*Information*/}
          <div
            id="information"
            className="h-min w-5/12 rounded-xl  border border-primary"
          >
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">Logga in</h2>

                <div className="items-center++´ flex flex-col">
                  {auth === AUTH.SIGN_IN ? (
                    <SignIn setAuth={setAuth} />
                  ) : (
                    <SignUp setAuth={setAuth} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Auth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
