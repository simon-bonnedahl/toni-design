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

const svgURIs = [];

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

const compileFiles = (files: any) => {
  let compiledFiles: any[] = [];
  let addedIds: number[] = [];
  for (let i = 0; i < files.length; i++) {
    if (!addedIds.includes(files[i].id)) {
      addedIds.push(files[i].id);
      compiledFiles.push({ ...files[i], quantity: 1 });
    } else {
      for (let j = 0; j < compiledFiles.length; j++) {
        if (compiledFiles[j].id === files[i].id) {
          compiledFiles[j].quantity += 1;
        }
      }
    }
  }
  return compiledFiles;
};

const compileSummary = (body: any) => {
  let html = `<h1>Order ${orderId}</h1>`;

  for (let i = 0; i < body.length; i++) {
    html += `<p>_________________________________</p>
        <br>
        <p><b>Produkt:</b> ${body[i].metadata.product} x ${body[i].quantity} </p>
        <p><b>Material:</b> ${body[i].metadata.material}</p>      
        <p><b>Storlek :</b> ${body[i].visual.width} x ${body[i].visual.height} </p>
        <p><b>Form: </b> ${body[i].visual.shape}</p>
        <p><b>Färgkombination: </b> ${body[i].metadata.colorCombination}</p>
        <p><b>Fäst metod:</b> ${body[i].metadata.application}</p>`;
  }
  html += "<p>_________________________________</p><p>Filer: </p>";

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
      let files = compileFiles(body);
      let zip = zipProductionFiles(files);
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
            .setHtml(compileSummary(files))
            .setText("This is the text content");

          mailersend.send(emailParams);
          res.status(200).json({ complete: true });
        });

    default:
      res.status(200).json({ complete: true });
  }
}
