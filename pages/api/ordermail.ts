// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");
const Attachment = require("mailersend").Attachment;
var fs = require("fs");
const { jsPDF } = require("jspdf");

const JSZip = require("jszip");

const mailersend = new MailerSend({
  api_key: process.env.MAILERSEND_API_KEY,
});

type Data = {
  complete: boolean;
};
const recipients = [
  new Recipient("simbo803@student.liu.se"),
  //new Recipient("gravyr@tonireklam.se"),
];

const generateOrderId = () => {
  let orderId = "";
  for (let i = 0; i < 10; i++) {
    orderId += Math.floor(Math.random() * 10);
  }
  return orderId;
};
const orderId = generateOrderId();

const zipProductionFiles = (products: any) => {
  // Svg
  const zip = new JSZip();
  for (let i = 0; i < products.length; i++) {
    fs.writeFileSync(
      "order-files/file-" + i + ".svg",
      products[i].data.svg,
      function (err: any) {
        if (err) throw err;
      }
    );
    const svg = zip.folder("svg");
    for (let i = 0; i < products.length; i++) {
      svg.file(
        "file-" + i + ".svg",
        fs.readFileSync("order-files/file-" + i + ".svg")
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
      pdf.save("order-files/file-" + i + ".pdf");
    }
    combined.save("order-files/combined.pdf");
    const pdf = zip.folder("pdf");
    for (let i = 0; i < products.length; i++) {
      pdf.file(
        "file-" + i + ".pdf",
        fs.readFileSync("order-files/file-" + i + ".pdf")
      );
    }

    zip.file("combined.pdf", fs.readFileSync("order-files/combined.pdf"));

    return zip;
  }
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

const compileSummary = (items: any, total: number, orderData: any) => {
  let html = `<h1 style="text-align: center;">Order ${orderId}</h1>`;

  for (let i = 0; i < items.length; i++) {
    html += `
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
        <img src="${items[i].data.pixelData}" alt="order-image" style="width: 50%; height: auto; border: 1px solid white; border-radius: 5px"/>
    </div>`;
  }
  html += ` <hr style="width: 100%"></hr>
  <h2>Beställningsuppgifter</h2>
    <p>${orderData.firstName} ${orderData.firstName}</p>
    <p>${orderData.address}</p>
    <p>${orderData.zipCode}, ${orderData.city}</p>      
    <p>${orderData.country}</p>
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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let requestMethod = req.method;
  let body = req.body;
  switch (requestMethod) {
    case "POST":
      console.log(body);
      let items = compileItems(body.items);
      let zip = zipProductionFiles(items);
      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream("order-files/files.zip"))
        .on("finish", function () {
          console.log("Done with files");
          let attachments = [
            new Attachment(
              fs.readFileSync("order-files/files.zip", { encoding: "base64" }),
              "order-" + orderId + ".zip",
              "attachment"
            ),
          ];
          let emailParams = new EmailParams()
            .setFrom("order@simonbonnedahl.dev")
            .setRecipients(recipients)
            .setAttachments(attachments)
            .setSubject("Order " + orderId + "")
            .setHtml(compileSummary(items, body.total, body.orderData))
            .setText("This is the text content");

          mailersend.send(emailParams);
          res.status(200).json({ complete: true });
        });

    default:
      res.status(200).json({ complete: true });
  }
}
