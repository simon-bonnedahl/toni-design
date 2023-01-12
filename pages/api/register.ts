import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../sanity";
const passwordHash = require("password-hash");

type Data = {
  message: string;
  response: {};
};

const checkDuplicate = async (email: string) => {
  const query = `*[_type == "account" && email == $email]`;
  const params = { email };
  const result = await client.fetch(query, params);

  if (result.length > 0) {
    console.log("found duplicate");
    return true;
  }
  return false;
};

const addAccount = async (body: any, res: any) => {
  const doc = {
    _type: "account",
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: passwordHash.generate(body.password),
    phone: body.phone,
    address: body.address,
    zipCode: body.zipCode,
    city: body.city,
    country: body.country,
  };
  client.create(doc).then(() => {
    console.log("Account created", doc);
    return res.status(200).json({ message: "Account created", response: doc });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let requestMethod = req.method;
  let body = req.body;
  switch (requestMethod) {
    case "POST":
      let foundDuplicate = await checkDuplicate(body.email);
      if (foundDuplicate)
        return res
          .status(400)
          .json({ message: "Email already exists", response: {} });

      addAccount(body, res);
  }
}
