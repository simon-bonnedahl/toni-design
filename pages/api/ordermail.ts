// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");
const Attachment = require("mailersend").Attachment;
var fs = require('fs');
const AdmZip = require("adm-zip");

async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = "test.zip";
  zip.writeZip(outputFile);
  console.log(`Created ${outputFile} successfully`);
}



const mailersend = new MailerSend({
api_key:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZGNkNTBmYmVlODFjM2RkMzRkZjJhYjE3NmNkMWI4ZDIyN2YwZDAwOTkxMWMwNGEyZmIyOTg1Yjc0YzMxNjE1YzA5MmIyNWM3NWU5MjNmYWQiLCJpYXQiOjE2NzI2MTYxNjYuNzcwNzQ2LCJuYmYiOjE2NzI2MTYxNjYuNzcwNzQ4LCJleHAiOjQ4MjgyODk3NjYuNzY2NTg1LCJzdWIiOiI1MTUwNiIsInNjb3BlcyI6WyJlbWFpbF9mdWxsIiwiZG9tYWluc19mdWxsIiwiYWN0aXZpdHlfZnVsbCIsImFuYWx5dGljc19mdWxsIiwidG9rZW5zX2Z1bGwiLCJ3ZWJob29rc19mdWxsIiwidGVtcGxhdGVzX2Z1bGwiLCJzdXBwcmVzc2lvbnNfZnVsbCIsInNtc19mdWxsIiwiZW1haWxfdmVyaWZpY2F0aW9uX2Z1bGwiLCJpbmJvdW5kc19mdWxsIiwicmVjaXBpZW50c19mdWxsIl19.VjhZIhr5o6JnTj0-2KrQ-Z0YgdHR5XXqMw2SohHtciPPz4UxuSLMKYlzLDWeRxTMiiAAu42QhmxBYreH_Eg_zHJZ_V9Sw1UJKYsMmCHZEBz8BnAY-eQBNlQORS1YV-InJGx7YNTMej_swd4XupfDMxyMi-X1fUTZtJmoSllIC053XZQNet01vlDDpEBfjjNb7vWviNHtVJRTElLvKap0Z-_n4if24m3riGjWHC4CLvseiGN_DdShOy8QiGHKoGLDJij9wUr-WaHYxFUwyqOdCpkTfMCZr-j2-l-YiAnvRJ1tNAbhiodZi7zG8dAn5DKswRALXRnkuFX3xkf_D3KEgtyzQcIi0AM9UtAC3m1pSWkIgK4TpndF0Btg8LNdfT-VwLDOB43P-ffogcfX5U8VuQL7uJIowj-igegk2fhsOP-OK5Bo3fHBdM29XsnjT9w-ptonbGAB3TUL6JNHn19fpsIu-tt48kSjUVmMebnvD00o2h4I5YRpwCJPKceJxRaKk4O6Fw_VPWtekvIdqE6iTLrRXDONDXXU18ULy_6EZ0sirAgyyhL3wXBEPiQWJ2CLNxjxt46IvEPIUvtIz-_PLCBoX7kQpfSXo4pCE3j1SlxL0OV_jBjcdKaWgCeaZ7qgDIs3Rs0rdLyRJwtHMDDbLB6lwDBnt6f7NUfx3FBlk4U",
});

type Data = {
  complete: boolean
}
const recipients = [
    new Recipient("simbo803@student.liu.se", "Order mail"),
    new Recipient("gravyr@tonireklam.se", "Order mail"),
];

const compileSummary = (body: any) => {
    let html = `
    <h1>Order</h1>
    <p><b>Produkt:</b> ${body.metadata.product}</p>
    <p>Material: ${body.metadata.material}</p>
    <p>Fäst metod: ${body.metadata.application}</p>
    <p>Storlek: ${body.visual.width} x ${body.visual.height} </p>
    <p>Form: ${body.visual.shape}</p>
    `;
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
            fs.writeFile('order.svg', body.data.svg, function (err:any) {
                if (err) throw err;
                console.log('Saved!');
                   const attachments = [new Attachment(fs.readFileSync('order.svg', {encoding: 'base64'}), 'file.svg', 'attachment')]
            let emailParams = new EmailParams()
            .setFrom("order@simonbonnedahl.dev")
      .setFromName("New Order")
      .setRecipients(recipients)
      .setAttachments(attachments)
      .setSubject("Order")
      .setHtml(compileSummary(body))
      .setText("This is the text content");

            mailersend.send(emailParams);
            res.status(200).json({ complete: true })
                });

            //createZipArchive();
       
         
                
            

            break;
        default:
            res.status(200).json({ complete: true })
    }
}
