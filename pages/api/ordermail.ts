import type { NextApiRequest, NextApiResponse } from "next";
const { jsPDF } = require("jspdf");
const JSZip = require("jszip");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type Data = {
  message: string;
  response: {};
};
const recipent = "simbo803@student.liu.se";
const sender = "contact@simonbonnedahl.dev";

const filePath = "../../tmp/";

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
  let compiledItems: any[] = [];
  let addedIds: number[] = [];
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
const detailsSummary = (orderData: any, total: number) => {
  let html = `<h2>Beställningsuppgifter</h2>
    <p>${orderData.firstName} ${orderData.lastName}</p>
    <p>${orderData.email}</p>
    <p>${orderData.address}</p>
    <p>${orderData.zipCode}, ${orderData.city}</p>      
    <p>${orderData.country}</p>
    <p>${orderData.phone}</p>
    <br>
    <p><b>Företag: </b>${orderData.company}</p>
    <br>
    <p><b>Leverans: </b>${orderData.delivery} </p>
    <p><b>Betalsätt: </b>${orderData.payment}</p>
    <p><b>Slutbelopp:</b> ${total} kr</p>  
    <br>
  `;
  return html;
};

const productionSummary = (
  items: any,
  total: number,
  orderData: any,
  orderId: number
) => {
  let html = `<h1 style="text-align: center;">Order #${orderId}</h1>`;
  html += itemsSummary(items);
  html += detailsSummary(orderData, total);

  html += ` <hr style="width: 100%"></hr>
  <h2>Produktionsfiler</h2>`;

  return html;
};

const confirmationSummary = (
  items: any,
  total: number,
  orderData: any,
  orderId: number
) => {
  let html = `<h1 style="text-align: center;">Order #${orderId}</h1>`;
  html += `<p>Vi har mottagit din beställning och kommer att skicka en bekräftelse när den är på väg.</p>
    <p>Om du har några frågor eller funderingar är du välkommen att kontakta oss på <a href="mailto:
    ${recipent}">${recipent}</a></p>`;
  html += itemsSummary(items);
  html += detailsSummary(orderData, total);

  return html;
};
const sendProductionMail = async (
  body: any,
  compiledItems: any,
  res: NextApiResponse<Data>
) => {
  const msg = {
    to: recipent,
    from: sender,
    subject: "Order #" + body.id,
    text: "Order #" + body.id,
    attachments: [
      {
        content: fs.readFileSync(filePath + "files.zip").toString("base64"),
        filename: "order-" + body.id + ".zip",
        type: "application/zip",
        disposition: "attachment",
      },
    ],
    html: productionSummary(compiledItems, body.total, body.orderData, body.id),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      sendConfirmationMail(body, compiledItems);
      res.status(200).json({ message: "Email sent", response: true });
    })
    .catch((error: any) => {
      console.error(error);
      res.status(400).json({ message: "Email not sent", response: false });
    });
};

const sendConfirmationMail = async (body: any, compiledItems: any) => {
  const msg = {
    to: body.orderData.email,
    from: sender,
    subject: "Orderbekräftelse #" + body.id,
    text: "Orderbekräftelse #" + body.id,
    html: confirmationSummary(
      compiledItems,
      body.total,
      body.orderData,
      body.id
    ),
  };
  sgMail.send(msg);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let requestMethod = req.method;
  let body = req.body;
  switch (requestMethod) {
    case "POST":
      if (body.items.length === 0) {
        res.status(400).json({ message: "No items in cart", response: false });
      }
      let compiledItems = compileItems(body.items);
      await writeSvgs(compiledItems);
      let zip = await zipSvgs(compiledItems);
      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream(filePath + "files.zip"))
        .on("finish", () => {
          console.log("Zip written");
          sendProductionMail(body, compiledItems, res);
        });
  }
}
