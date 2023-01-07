import { useEffect, useState } from "react";
import Head from "next/head";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import countriesEurope from "../../utils/countriesEurope";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCustomer,
} from "../../reducers/cartSlice";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import SuccessAlert from "../../components/alerts/SuccessAlert";
import { useRouter } from "next/router";
import client from "../../sanity";
import Footer from "../../components/Footer";

function Home() {
  //Setup statevariables for all checkout fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Sverige");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    address: true,
    zipCode: true,
    city: true,
    country: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const customer = useSelector(selectCustomer);
  const router = useRouter();
  const dispatch = useDispatch();

  const validateFirstname = (name: string) => {
    setFirstName(name);
    if (name.length < 2) {
      document.getElementById("firstname")?.classList.add("input-error");
      setErrors({ ...errors, firstName: true });
    } else {
      document.getElementById("firstname")?.classList.remove("input-error");
      setErrors({ ...errors, firstName: false });
    }
  };
  const validateLastname = (name: string) => {
    setLastName(name);
    if (name.length < 2) {
      document.getElementById("lastname")?.classList.add("input-error");
      setErrors({ ...errors, lastName: true });
    } else {
      document.getElementById("lastname")?.classList.remove("input-error");
      setErrors({ ...errors, lastName: false });
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    setEmail(email);
    if (!re.test(email)) {
      document.getElementById("email")?.classList.add("input-error");
      setErrors({ ...errors, email: true });
    } else {
      document.getElementById("email")?.classList.remove("input-error");
      setErrors({ ...errors, email: false });
    }
  };

  const validatePhone = (phone: string) => {
    setPhone(phone);
    if (phone.length < 10) {
      document.getElementById("phone")?.classList.add("input-error");
      setErrors({ ...errors, phone: true });
    } else {
      document.getElementById("phone")?.classList.remove("input-error");
      setErrors({ ...errors, phone: false });
    }
  };

  const validateAddress = (address: string) => {
    setAddress(address);
    if (address.length < 5) {
      document.getElementById("address")?.classList.add("input-error");
      setErrors({ ...errors, address: true });
    } else {
      document.getElementById("address")?.classList.remove("input-error");
      setErrors({ ...errors, address: false });
    }
  };
  const validateZipCode = (zipCode: string) => {
    setZipCode(zipCode);
    if (zipCode.length < 5) {
      document.getElementById("zipCode")?.classList.add("input-error");
      setErrors({ ...errors, zipCode: true });
    } else {
      document.getElementById("zipCode")?.classList.remove("input-error");
      setErrors({ ...errors, zipCode: false });
    }
  };
  const validateCity = (city: string) => {
    setCity(city);
    if (city.length < 2) {
      document.getElementById("city")?.classList.add("input-error");
      setErrors({ ...errors, city: true });
    } else {
      document.getElementById("city")?.classList.remove("input-error");
      setErrors({ ...errors, city: false });
    }
  };

  const allFieldsValid = () => {
    if (
      errors.firstName ||
      errors.lastName ||
      errors.email ||
      errors.phone ||
      errors.address ||
      errors.zipCode ||
      errors.city
    ) {
      //add input error class to the field that is not valid and focus that field
      if (errors.firstName) {
        document.getElementById("firstname")?.classList.add("input-error");
        document.getElementById("firstname")?.focus();
      }
      if (errors.lastName) {
        document.getElementById("lastname")?.classList.add("input-error");
        document.getElementById("lastname")?.focus();
      }
      if (errors.email) {
        document.getElementById("email")?.classList.add("input-error");
      }
      if (errors.phone) {
        document.getElementById("phone")?.classList.add("input-error");
      }
      if (errors.address) {
        document.getElementById("address")?.classList.add("input-error");
      }
      if (errors.zipCode) {
        document.getElementById("zipCode")?.classList.add("input-error");
      }
      if (errors.city) {
        document.getElementById("city")?.classList.add("input-error");
      }
      setError("Fyll i alla fält");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleCheckFields = () => {
    if (allFieldsValid()) {
      //disable the iformation form and focus delivery
      document.getElementById("information")?.classList.add("opacity-40");
      document
        .getElementById("information")
        ?.classList.add("pointer-events-none");

      //scroll down to delivery choice
      document.getElementById("delivery-choice")?.scrollIntoView({
        behavior: "smooth",
      });
      document
        .getElementById("delivery-choice")
        ?.classList.remove("opacity-40");
      document
        .getElementById("delivery-choice")
        ?.classList.remove("pointer-events-none");
      document.getElementById("payment-choice")?.classList.remove("opacity-40");
      document
        .getElementById("payment-choice")
        ?.classList.remove("pointer-events-none");

      document.getElementById("payment-button")?.classList.remove("opacity-40");
      document
        .getElementById("payment-button")
        ?.classList.remove("pointer-events-none");
    }
  };

  const handlePlaceOrder = async () => {
    //validate delivery and payment
    if (deliveryMethod == "") {
      setError("Välj leverans");
      return;
    }
    if (paymentMethod == "") {
      setError("Välj betalsätt");
      return;
    }

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
      company: company,
    };
    let orders = await client.fetch(`*[_type == "order"]`);

    let body = {
      items: items,
      total: total,
      orderData: data,
      id: orders.length + 1,
    };
    fetch("/api/ordermail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
      });
      console.log(res);
      if (res.status == 200) {
        setError("");
        setSuccess("Beställningen är bekräftad");
        setTimeout(() => {
          //add the order to the database
          const doc = {
            _type: "order",
            id: orders.length + 1,
            total: total,
            orderData: data,
            //items how?
          };

          client.create(doc).then(() => {
            console.log("Order created", doc);
          });
          router.push("/receipt");
          //clear the cart
          dispatch(clearCart());
        }, 2000);
      } else if (res.status == 400) {
        setError("Något gick fel, se till att du har varor i kundvagnen");
      } else {
        setError("Något gick fel, prova igen senare");
      }
    });
  };

  return (
    <div>
      <Head>
        <title>Kassa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen overflow-scroll">
        <HeaderBar />
        <Navbar />
        <div className="w-full mt-20 flex flex-col space-y-10 items-center">
          <h1 className="text-4xl">Kassa</h1>

          {/*Form*/}

          {/*Information*/}
          <div
            id="information"
            className="border border-primary w-5/12 rounded-xl"
          >
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">1. Din Information</h2>
                <div className="flex flex-col">
                  <label>* Förnamn</label>
                  <input
                    id="firstname"
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    value={firstName}
                    onChange={(e) => validateFirstname(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Efternamn</label>
                  <input
                    id="lastname"
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    value={lastName}
                    onChange={(e) => validateLastname(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* E-post</label>
                  <input
                    id="email"
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    required
                    placeholder="Används för kvitto och orderinformation"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                </div>
                {customer === "company" && (
                  <div className="flex flex-col">
                    <label>Företagsnamn</label>
                    <input
                      id="company"
                      className="input input-bordered input-primary w-full max-w-xs"
                      type="text"
                      placeholder="Valfritt"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <label>* Telefon</label>
                  <input
                    id="phone"
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    placeholder="Används för avisering"
                    value={phone}
                    onChange={(e) => validatePhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Adress</label>
                  <input
                    id="address"
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={address}
                    onChange={(e) => validateAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Postnummer</label>
                  <input
                    id="zipCode"
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={zipCode}
                    onChange={(e) => validateZipCode(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>* Stad</label>
                  <input
                    id="city"
                    className="input input-bordered input-primary w-full max-w-xs"
                    type="text"
                    value={city}
                    onChange={(e) => validateCity(e.target.value)}
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
          <div
            id="delivery-choice"
            className="border border-primary w-5/12 rounded-xl pointer-events-none opacity-40"
          >
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
                        Spårbart paket
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
          <div
            id="payment-choice"
            className="border border-primary w-5/12 justify-between flex rounded-xl relative pointer-events-none opacity-40"
          >
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
                        disabled
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
                        disabled
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
            {/*Summary*/}
            <div className="p-8 flex-col space-y-5 w-72 absolute -right-80 border border-primary rounded-xl">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">Sammanställning</h2>
                <div className="flex justify-between">
                  <p>Dina varor</p>
                  <p>{total} kr</p>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p>Leverans</p>
                    <p className="text-xs">{deliveryMethod} </p>
                  </div>
                  <p>39.00 kr</p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p>Pris exkl.moms</p>
                  <p>{total + 39}</p>
                </div>
                <div className="flex justify-between">
                  <p>Moms(25%)</p>
                  <p>{total * 0.25}</p>
                </div>
                <hr />

                <div className="flex justify-between pb-5">
                  <p>Totalt</p>
                  <p>{total * 1.25 + 39} kr</p>
                </div>
              </div>
            </div>
          </div>
          {/*Betalknapp*/}
          <button
            id="payment-button"
            className="btn btn-info w-5/12 opacity-40 pointer-events-none"
            onClick={handlePlaceOrder}
          >
            <FontAwesomeIcon className="scale-125" icon={faLock} />
            <span className="ml-4 text-info-content">Slutför köp</span>
          </button>
          <p className="text-sm w-5/12">
            Genom att lägga en bestllning godkänner du våra köpvillkor och
            informationen i vår intigritetspolicy.
          </p>
        </div>
        {/*Footer*/}
        <Footer />

        {success && (
          <div onClick={() => setSuccess("")}>
            <SuccessAlert text={success} />
          </div>
        )}

        {error && (
          <div onClick={() => setError("")}>
            <ErrorAlert text={error} />
          </div>
        )}
      </main>
    </div>
  );
}
export default Home;
