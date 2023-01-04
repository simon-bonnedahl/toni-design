import React, { useState } from "react";
import Head from "next/head";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import countriesEurope from "../../utils/countriesEurope";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../reducers/cartSlice";

function Home() {
  //Setup statevariables for all checkout fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Sverige");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleCheckFields = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      phone === "" ||
      address === "" ||
      zipCode === "" ||
      city === "" ||
      country === "" ||
      deliveryMethod === "" ||
      paymentMethod === ""
    ) {
      setError("Alla fält måste vara ifyllda");
    } else {
      setError("");
    }
  };

  const handlePlaceOrder = () => {
    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      zipCode: zipCode,
      city: city,
      country: country,
      delivery: deliveryMethod,
      payment: paymentMethod,
    };

    let body = { items: items, total: total, orderData: data };
    fetch("/api/ordermail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      res.json();
      console.log(res);
      if (res.status == 200) {
        alert("Order placed successfully");
      } else {
        alert("Something went wrong");
      }
    });
  };

  return (
    <div>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen overflow-scroll">
        <HeaderBar />
        <Navbar />
        <div className=" h-screen mx-96 mt-20 flex-col space-y-6">
          <h1 className="text-4xl">Kassa</h1>
          {/*Information*/}
          <div className="border border-primary w-7/12 rounded-md">
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">1. Din Information</h2>
                <div className="flex flex-col">
                  <label>* Förnamn</label>
                  <input
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Efternamn</label>
                  <input
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* E-post</label>
                  <input
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    required
                    placeholder="Används för kvitto och orderinformation"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Telefon</label>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    placeholder="Används för avisering"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Adress</label>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Postnummer</label>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Stad</label>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Land</label>
                  <select className="select select-bordered border-primary w-full max-w-xs">
                    {countriesEurope.map((c) => {
                      if (c === country)
                        return (
                          <option key={c} selected>
                            {c}
                          </option>
                        );
                      else return <option key={c}>{c}</option>;
                    })}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    className="checkbox checkbox-primary"
                    type="checkbox"
                  />

                  <label>
                    Ja, jag vill skapa ett konto och se min orderhistorik och
                    mer
                  </label>
                </div>
                <button className="btn btn-info" onClick={handleCheckFields}>
                  <FontAwesomeIcon className="scale-125" icon={faCheck} />
                  <span className="ml-4 text-info-content">Fortsätt</span>
                </button>
                <p className="text-sm">
                  Information om hur vi använder denna användardata. Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Ipsum possimus
                  ipsam reiciendis optio autem vero laborum mollitia alias ad,
                  delectus recusandae! Eum nesciunt magni quam, ea doloribus
                  ullam aut ab.
                </p>
              </div>
            </div>
          </div>
          {/*Leverans*/}

          <div className="border border-primary w-7/12 rounded-md">
            <div className="p-8 flex-col space-y-5">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">2. Leveransätt</h2>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-9"
                        className="radio checked:bg-primary"
                        onChange={() => setDeliveryMethod("Brev")}
                      />
                      <span className="label-text ml-4 text-lg">Brev</span>
                    </label>
                  </div>
                  <p>
                    Leveranstid 3-5 vardagar, 39.00 kr inkl.moms, Ej Spårbart
                  </p>
                </div>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-9"
                        className="radio checked:bg-primary"
                        onChange={() => setDeliveryMethod("Spårbart paket")}
                      />
                      <span className="label-text ml-4 text-lg">
                        Spårbartpaket
                      </span>
                    </label>
                  </div>
                  <p>
                    Leveranstid 3-6 vardagar, 129.00 kr inkl.moms, Spårbar
                    försändelse
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/*Betalsätt*/}
          <div className="border border-primary w-7/12 rounded-md">
            <div className="p-8 flex-col space-y-5">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">3. Betalsätt</h2>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-primary"
                        onChange={() => setPaymentMethod("Swish")}
                      />
                      <span className="label-text ml-4 text-lg">
                        Betala med Swish
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-primary"
                        onChange={() => setPaymentMethod("Kort")}
                      />
                      <span className="label-text ml-4 text-lg">
                        Betala med kort
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-primary"
                        onChange={() => setPaymentMethod("E-postfaktura")}
                      />
                      <span className="label-text ml-4 text-lg">
                        Betala med e-postfaktura
                      </span>
                    </label>
                  </div>
                  <p className="ml-10 text-xs">29.00 kr inkl.moms</p>
                </div>
                <div>
                  <div className="form-control flex items-start">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-primary"
                        onChange={() => setPaymentMethod("Papperfaktura")}
                      />
                      <span className="label-text ml-4 text-lg">
                        Betala med papperfaktura
                      </span>
                    </label>
                  </div>
                  <p className="ml-10 text-xs">39.00 kr inkl.moms</p>
                </div>
              </div>
            </div>
          </div>
          <button className="btn btn-info w-7/12" onClick={handlePlaceOrder}>
            <FontAwesomeIcon className="scale-125" icon={faLock} />
            <span className="ml-4 text-info-content">Slutför köp</span>
          </button>
          <p className="text-sm w-7/12">
            Genom att lägga en bestllning godkänner du våra köpvillkor och
            informationen i vår intigritetspolicy.
          </p>
          {/*Footer*/}
          <div className="h-screen"></div>
        </div>
      </main>
    </div>
  );
}
export default Home;
