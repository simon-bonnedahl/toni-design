/* eslint @typescript-eslint/no-var-requires: "off" */
import { z } from "zod";
import sanityDB from "../../../../sanity";
import { router, publicProcedure } from "../trpc";
const JSZip = require("jszip");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const CustomerDetailsZod = z.object({
  firstname: z
    .string()
    .min(2, { message: "Förnamnet måste vara minst 2 karaktärer" }),
  lastname: z
    .string()
    .min(2, { message: "Efternamnet måste vara minst 2 karaktärer" }),
  email: z.string().email(),
  phone: z
    .string()
    .min(10, { message: "Telefonnumret måste vara minst 10 karaktärer" }),
  address: z
    .string()
    .min(5, { message: "Adressen måste vara minst 5 karaktärer" }),
  zipCode: z
    .string()
    .min(5, { message: "Postnumret måste vara minst 5 karaktärer" }),
  city: z
    .string()
    .min(2, { message: "Ortnamnet måste vara minst 2 karaktärer" }),
  country: z.string(),
  company: z.string().optional(),
});
type CustomerDetails = z.infer<typeof CustomerDetailsZod>;

const OrderDetailsZod = z.object({
  paymentMethod: z.string(),
  deliveryMethod: z.string(),
  total: z.number(),
});

type OrderDetails = z.infer<typeof OrderDetailsZod>;

const recipent = "simbo803@student.liu.se";
const sender = "contact@simonbonnedahl.dev";
const filePath = "../../tmp/";

export const orderRouter = router({
  placeOrder: publicProcedure
    .input(
      z.object({
        items: z.array(z.any()).min(1, { message: "Varukorgen är tom" }),
        orderDetails: OrderDetailsZod,
        customerDetails: CustomerDetailsZod,
      })
    )
    .mutation(async ({ input, ctx }) => {
      //Check for duplicate orderid
      const latestOrder = await sanityDB.fetch(
        `*[_type == "order"] | order(_createdAt desc) [0]{orderId}`
      );
      console.log(latestOrder);
      const orderId = latestOrder.orderId + 1;
      const { items, orderDetails, customerDetails } = input;
      const compiledItems = compileItems(items);
      await writeSvgs(compiledItems);
      const zip = await zipSvgs(compiledItems);
      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream(filePath + "files.zip"))
        .on("finish", () => {
          console.log("Zip written");
          sendProductionMail(
            orderId,
            customerDetails,
            orderDetails,
            compiledItems
          );
          //sendConfirmationMail(orderId, customerDetails, total, compiledItems);
          saveOrder(orderId, customerDetails, orderDetails, compiledItems);
        });
    }),
});

const writeSvgs = async (products: any) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      fs.writeFileSync(
        filePath + "file-" + (i + 1) + ".svg",
        products[i].data.svg,
        function (err: any) {
          if (err) {
            return console.log(err);
          }
        }
      );
    }
  }
  console.log("Svgs written ");
};

const zipSvgs = async (products: any) => {
  const zip = new JSZip();
  const svg = zip.folder("svg");
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      svg.file(
        "file-" + (i + 1) + ".svg",
        fs.readFileSync(filePath + "file-" + (i + 1) + ".svg")
      );
    }
  }
  console.log("Svgs zipped");
  return zip;
};

const compileItems = (items: any) => {
  const compiledItems: any[] = [];
  const addedIds: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!addedIds.includes(items[i].id)) {
      addedIds.push(items[i].id);
      compiledItems.push({ ...items[i], quantity: 1 });
    } else {
      for (let j = 0; j < compiledItems.length; j++) {
        if (compiledItems[j].id === items[i].id) {
          compiledItems[j].quantity += 1;
        }
      }
    }
  }
  console.log("Compiled items");
  return compiledItems;
};

const itemsSummary = (items: any) => {
  let html = "";
  for (let i = 0; i < items.length; i++) {
    let img = "";
    if (items[i].data.svg) {
      img = `<img src="${items[i].data.pixelData}" alt="order-image" style="width:125%; height: auto;"/>`;
    } else {
      img = `<img src="${items[i].data.pixelData}" alt="order-image" style="width:auto; height: 50%;"/>`;
    }
    html +=
      `
    <hr style="width: 100%"></hr>
    <div style="display:flex; justify-content: space-evenly;">
      <div>
          <p><b>Produkt:</b> ${items[i].metadata.product} x ${items[i].quantity} </p>
          <p><b>Material:</b> ${items[i].metadata.material}</p>      
          <p><b>Storlek :</b> ${items[i].visual.width} x ${items[i].visual.height} </p>
          <p><b>Form: </b> ${items[i].visual.shape}</p>
          <p><b>Färgkombination: </b> ${items[i].metadata.colorCombination}</p>
          <p><b>Fäst metod:</b> ${items[i].metadata.application}</p>          
      </div> 
      <div style="display:flex; justify-content: center; align-items:center; width:250px; height:250px; border: 1px solid white; border-radius: 5px;">` +
      img +
      `
      </div>
    </div>`;
  }
  return html;
};
const detailsSummary = (
  customerDetails: CustomerDetails,
  orderDetails: OrderDetails
) => {
  const html = `<h2>Beställningsuppgifter</h2>
    <p>${customerDetails.firstname} ${customerDetails.lastname}</p>
    <p>${customerDetails.email}</p>
    <p>${customerDetails.address}</p>
    <p>${customerDetails.zipCode}, ${customerDetails.city}</p>      
    <p>${customerDetails.country}</p>
    <p>${customerDetails.phone}</p>
    <br>
    <p><b>Företag: </b>${customerDetails.company}</p>
    <br>
    <p><b>Leverans: </b>${orderDetails.deliveryMethod} </p>
    <p><b>Betalsätt: </b>${orderDetails.paymentMethod}</p>
    <p><b>Slutbelopp:</b> ${orderDetails.total} kr</p>  
    <br>
  `;
  return html;
};

const productionSummary = (
  items: any,
  orderDetails: OrderDetails,
  customerDetails: CustomerDetails,
  orderId: number
) => {
  let html = `<h1 style="text-align: center;">Order #${orderId}</h1>`;
  html += itemsSummary(items);
  html += detailsSummary(customerDetails, orderDetails);

  html += ` <hr style="width: 100%"></hr>
  <h2>Produktionsfiler</h2>`;

  return html;
};

const confirmationSummary = (
  items: any,
  orderDetails: OrderDetails,
  customerDetails: CustomerDetails,
  orderId: number
) => {
  let html = `<h1 style="text-align: center;">Order #${orderId}</h1>`;
  html += `<p>Vi har mottagit din beställning och kommer att skicka en bekräftelse när den är på väg.</p>
    <p>Om du har några frågor eller funderingar är du välkommen att kontakta oss på <a href="mailto:
    ${recipent}">${recipent}</a></p>`;
  html += itemsSummary(items);
  html += detailsSummary(customerDetails, orderDetails);

  return html;
};
const sendProductionMail = async (
  orderId: number,
  customerDetails: CustomerDetails,
  orderDetails: OrderDetails,
  compiledItems: any
) => {
  const msg = {
    to: recipent,
    from: sender,
    subject: "Order #" + orderId,
    text: "Order #" + orderId,
    attachments: [
      {
        content: fs.readFileSync(filePath + "files.zip").toString("base64"),
        filename: "order-" + orderId + ".zip",
        type: "application/zip",
        disposition: "attachment",
      },
    ],
    html: productionSummary(
      compiledItems,
      orderDetails,
      customerDetails,
      orderId
    ),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      sendConfirmationMail(
        orderId,
        customerDetails,
        orderDetails,
        compiledItems
      );
    })
    .catch((error: any) => {
      console.error(error);
    });
};

const sendConfirmationMail = async (
  orderId: number,
  customerDetails: CustomerDetails,
  orderDetails: OrderDetails,
  compiledItems: any
) => {
  const msg = {
    to: customerDetails.email,
    from: sender,
    subject: "Orderbekräftelse #" + orderId,
    text: "Orderbekräftelse #" + orderId,
    html: confirmationSummary(
      compiledItems,
      orderDetails,
      customerDetails,
      orderId
    ),
  };
  sgMail.send(msg);
};

const saveOrder = async (
  orderId: number,
  customerDetails: CustomerDetails,
  orderDetails: OrderDetails,
  items: any
) => {
  const order = {
    _type: "order",
    orderDate: new Date(),
    orderId: orderId,
    customerDetails: customerDetails,
    orderDetails: orderDetails,
    //items how?
  };

  sanityDB.create(order).then(() => {
    console.log("Order created", order);
  });
};
