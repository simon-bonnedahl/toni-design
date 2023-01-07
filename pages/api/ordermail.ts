// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { waitForDebugger } from "inspector";
import type { NextApiRequest, NextApiResponse } from "next";
const Attachment = require("mailersend").Attachment;
const { jsPDF } = require("jspdf");
const JSZip = require("jszip");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type Data = {
  message: string;
  response: {};
};

const writeSvgs = async (products: any) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      fs.writeFileSync(
        process.cwd() + "/tmp/file-" + i + ".svg",
        products[i].data.svg
      );
    }
  }
  console.log("Svgs written");
};
const zipSvgs = async (products: any, zip: any) => {
  const svg = zip.folder("svg");
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      svg.file(
        "file-" + i + ".svg",
        fs.readFileSync(process.cwd() + "/tmp/file-" + i + ".svg")
      );
    }
  }
  console.log("Svgs zipped");
};

const zipProductionFiles = async (products: any) => {
  // Svg
  const zip = new JSZip();
  writeSvgs(products);
  setTimeout(() => {
    zipSvgs(products, zip);

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(process.cwd() + "/tmp/files.zip"))
      .on("finish", function () {
        console.log("Zip written");
      });
  }, 1000);
};

/*
      const svg = zip.folder("svg");
      for (let i = 0; i < products.length; i++) {
        svg.file(
          "file-" + i + ".svg",
          fs.readFileSync(process.cwd() + "/tmp/file-" + i + ".svg")
        );
      }
      // Pdf
      let combined = new jsPDF({ orientation: "p", format: "a2", unit: "mm" });
      let y = 0;
      for (let i = 0; i < products.length; i++) {
        let pixelData = products[i].data.pixelData;
        let pdf = new jsPDF({ orientation: "l", unit: "mm", format: "a3" });
        pdf.addImage(pixelData, "JPEG", 0, 0);
        combined.addImage(pixelData, "JPEG", 0, y);
        y += products[i].visual.height;
        pdf.save(process.cwd() + "/tmp/file-" + i + ".pdf");
      }
      combined.save(process.cwd() + "/tmp/combined.pdf");
      const pdf = zip.folder("pdf");
      for (let i = 0; i < products.length; i++) {
        pdf.file(
          "file-" + i + ".pdf",
          fs.readFileSync(process.cwd() + "/tmp/file-" + i + ".pdf")
        );
      }

      zip.file(
        "combined.pdf",
        fs.readFileSync(process.cwd() + "/tmp/combined.pdf")
      );
    }
  }*/

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

const compileSummary = (
  items: any,
  total: number,
  orderData: any,
  orderId: number
) => {
  let html = `<h1 style="text-align: center;">Order #${orderId}</h1>`;

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
  html += ` <hr style="width: 100%"></hr>
  <h2>Beställningsuppgifter</h2>
    <p>${orderData.firstName} ${orderData.lastName}</p>
    <p>${orderData.email}</p>
    <p>${orderData.address}</p>
    <p>${orderData.zipCode}, ${orderData.city}</p>      
    <p>${orderData.country}</p>
    <p>${orderData.phone}</p>
    <p>${orderData.company}</p>
    <br>
    <p><b>Leverans: </b>${orderData.delivery} </p>
    <p><b>Betalsätt: </b>${orderData.payment}</p>
    <p><b>Slutbelopp:</b> ${total} kr</p>  
    <br>
  `;
  html += ` <hr style="width: 100%"></hr>
  <h2>Produktionsfiler</h2>`;

  return html;
};

const wait = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let requestMethod = req.method;
  let body = req.body;
  switch (requestMethod) {
    case "POST":
      console.log(body);
      if (body.items.length === 0) {
        res.status(400).json({ message: "No items in order", response: false });
      }
      let compiledItems = compileItems(body.items);

      // zipProductionFiles(compiledItems);

      writeSvgs(compiledItems);

      await wait(1000);

      let attachment1 = fs
        .readFileSync(process.cwd() + "/tmp/file-0.svg")
        .toString("base64");

      let attachment2 = fs
        .readFileSync(process.cwd() + "/tmp/file-1.svg")
        .toString("base64");

      const msg = {
        to: "simbo803@student.liu.se", // Change to your recipient
        from: "contact@simonbonnedahl.dev", // Change to your verified sender
        subject: "Order #" + body.id,
        text: "Order #" + body.id,
        attachments: [
          {
            content: attachment1,
            filename: "file-" + "1" + ".svg",
            type: "application/svg",
            disposition: "attachment",
          },
          {
            content: attachment2,
            filename: "order-" + "2" + ".svg",
            type: "application/svg",
            disposition: "attachment",
          },
        ],
        html: compileSummary(
          compiledItems,
          body.total,
          body.orderData,
          body.id
        ),
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
          res.status(200).json({ message: "Email sent", response: true });
        })
        .catch((error: any) => {
          console.error(error);
          res.status(400).json({ message: "Email not sent", response: false });
        });
  }
}
