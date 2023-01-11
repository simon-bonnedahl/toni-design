import Head from "next/head";
import { useState } from "react";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import Navbar from "../../components/Navbar";
import countriesEurope from "../../utils/countriesEurope";

function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Sverige");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    phone: true,
    address: true,
    zipCode: true,
    city: true,
    country: true,
    company: true,
    orgNumber: true,
    reference: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  const validatePassword = (password: string) => {
    setPassword(password);
    if (password.length < 8) {
      document.getElementById("password")?.classList.add("input-error");
      setErrors({ ...errors, password: true });
    } else {
      document.getElementById("password")?.classList.remove("input-error");
      setErrors({ ...errors, password: false });
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

  const handleRegister = async () => {
    let body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      zipCode: zipCode,
      city: city,
      country: country,
    };

    setLoading(true);
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      console.log(res);
      res.json();
      console.log(res);
      if (res.status == 200) {
        setError("");
        setSuccess("Beställningen är bekräftad");
      } else if (res.status == 400) {
        setLoading(false);
        setError("Något gick fel, se till att du har varor i kundvagnen");
      } else {
        setLoading(false);
        setError("Något gick fel, prova igen senare");
      }
    });
  };

  return (
    <div>
      <Head>
        <title>Produkt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-base-100 w-screen">
        <HeaderBar />
        <Navbar />
        <div className="flex mx-10 justify-center space-x-10 mt-10 ">
          {/*Form*/}
          {/*Information*/}
          <div
            id="information"
            className="border border-primary w-5/12  h-min rounded-xl"
          >
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">Kund sedan tidigare</h2>

                <div className="flex flex-col">
                  <label>E-post</label>
                  <input
                    id="email"
                    className="input input-bordered input-primary w-full max-w"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label>Lösenord</label>
                  <input
                    id="password"
                    className="input input-bordered input-primary w-full max-w"
                    type="password"
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-info text-white">Logga in</button>
              </div>
            </div>
          </div>
          <div
            id="information"
            className="border border-primary w-5/12 rounded-xl"
          >
            <div className="p-8">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl">Ny kund</h2>

                <div>
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
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
export default Home;
