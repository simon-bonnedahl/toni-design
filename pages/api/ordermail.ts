// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { time } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");
const Attachment = require("mailersend").Attachment;
var fs = require("fs");
const { jsPDF } = require("jspdf");
const JSZip = require("jszip");
const axios = require("axios");
const sgMail = require("@sendgrid/mail");
const mailersend = new MailerSend({
  api_key:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmJjOGRlMjRhMmU4Y2I0ZmM5ZTkyZjQ0MmQ4ODAyZmIyZDY1M2U0N2MzM2E3ZTEwNzdlM2E3MGRiZTMwYTJlZjAwZTUyNWU0ZWFmYWY1ZjEiLCJpYXQiOjE2NzI2NjU1MjcuNzgyNzgsIm5iZiI6MTY3MjY2NTUyNy43ODI3ODMsImV4cCI6NDgyODMzOTEyNy43NzQ3NjQsInN1YiI6IjUxNTA2Iiwic2NvcGVzIjpbImVtYWlsX2Z1bGwiLCJkb21haW5zX2Z1bGwiLCJhY3Rpdml0eV9mdWxsIiwiYW5hbHl0aWNzX2Z1bGwiLCJ0b2tlbnNfZnVsbCIsIndlYmhvb2tzX2Z1bGwiLCJ0ZW1wbGF0ZXNfZnVsbCIsInN1cHByZXNzaW9uc19mdWxsIiwic21zX2Z1bGwiLCJlbWFpbF92ZXJpZmljYXRpb25fZnVsbCIsImluYm91bmRzX2Z1bGwiLCJyZWNpcGllbnRzX2Z1bGwiXX0.J_fCAexGiiInAB1r15a5zp54ZyEhBiYXYRQYDm00nUIQxJwKcjCtwFhidvYGaQ00sVsf7P5g_GjKNQWOGDYiHaNDvRWSSolb12Y0OzcSFHwfCPDlEPGktcS2DpL1g7GzdCzORO50Bx_-3B5b0L8U52piGx5dnScJlrrQpwL15Q1bphu478Rrpoa7YIcy6SrsBMILrNc-TtYz2k6elTzSUNIe_zXVmJ7RFJQ_EQu5u9YLLk7sTNF4oEzDt5TsYe9mu8NlAg5XJsz_ZgU28-0d729IOMGEn_pLRCpr4uGMkjh6aPVr6uPrY1D6phuun4cE8FJFtA6uWXsVpXSs6PQVl1B5Y9TiNIErE4ubt5Gpgbwq0LS3G0CKDPihAPNT5O9wDl4ZJ0-WsXUZXAumiddaczW4svO5R_AsXIvEn4Qa0Si7BCBFS6QlKLP8Y2QrvhtgS2xCyfalUr2PUpOdgUO3mUwBtiuILjZg6z6SbEjQA7jpKrsHxFp3csjtMNApvlQuMlhshlOYkcze8lXMXLNRj4CngRs1W55ZeDNWCvvMlc3THJ897wm5jjwQXiWchFuSEmekgDOcALXu2jmz66Dn5eS8ImCRvFphGFxSIKhomOrDcS3bgD2Igc00X5QTa3Cv4EaS5pt2YjtusaDaF_6CnvoNYPSNlP1yEdtaFXf7WaE",
});

type Data = {
  message: string;
  response: {};
};
const recipients = [
  new Recipient("simbo803@student.liu.se"),
  //new Recipient("gravyr@tonireklam.se"),
];

const writeSvgs = async (products: any) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      fs.writeFile(
        process.cwd() + "/tmp/file-" + i + ".svg",
        products[i].data.svg,
        function (err: any) {
          if (err) {
            return console.log(err);
          }
        }
      );
    }
  }
  console.log("Done 1");
};
const zipSvgs = async (products: any, zip: any, res: any) => {
  const svg = zip.folder("svg");
  for (let i = 0; i < products.length; i++) {
    if (products[i].data.svg.length > 0) {
      svg.file(
        "file-" + i + ".svg",
        fs.readFileSync(process.cwd() + "/tmp/file-" + i + ".svg")
      );
    }
  }
  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(fs.createWriteStream("tmp/files.zip"))
    .on("finish", function () {
      console.log("Done with files");
      let attachments = [
        new Attachment(
          fs.readFileSync("tmp/files.zip", { encoding: "base64" }),
          "order-" + "test" + ".zip",
          "attachment"
        ),
      ];
    });
};

const zipProductionFiles = async (products: any, res: any) => {
  // Svg
  const zip = new JSZip();
  writeSvgs(products);
  setTimeout(() => {
    zipSvgs(products, zip, res);
    console.log("Svgs zipped");
  }, 1000);

  //timeout so that the svgs have time to be written before we return the zip
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

const sendMail = async (body: any, res: any) => {
  const compiledItems = compileItems(body.items);
  const compiledSummary = compileSummary(
    compiledItems,
    body.total,
    body.orderData,
    body.orderId
  );
  zipProductionFiles(compiledItems, res);
  /*
  const attachment = new Attachment(
    zipBuffer,
    "order-" + body.orderId + ".zip",
    "attachment"
  );
  const emailParams = new EmailParams()
    .setFrom("order@simonbonnedahl.dev")
    .setFromName("Simon Bonnedahl")
    .setRecipients(recipients)
    .setAttachments([attachment])
    .setSubject("Order #" + body.orderId)
    .setHtml(compiledSummary);

  mailersend.send(emailParams);*/
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
      let emailParams = new EmailParams()
        .setFrom("order@simonbonnedahl.dev")
        .setRecipients(recipients)

        .setSubject("Order " + "test" + "")
        .setHtml("test")
        .setText("This is the text content");

      mailersend.send(emailParams).then((response: any) => {
        console.log(response);
        res.status(200).json({ message: "Success", response: response });
      });
  }
}
