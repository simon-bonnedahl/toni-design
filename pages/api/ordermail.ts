// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");
const Attachment = require("mailersend").Attachment;
var fs = require('fs');
require("dotenv").config();





const mailersend = new MailerSend({
api_key:
    process.env.MAILERSEND_API_KEY,
});

type Data = {
  complete: boolean
}
const recipients = [
    new Recipient("simbo803@student.liu.se"),
    //new Recipient("gravyr@tonireklam.se"),
   
];

const saveProductionFiles = (body: any) => {
    for (let i = 0; i < body.length; i++) {
    fs.writeFileSync('file-' + i + '.svg', body[i].data.svg, function (err:any) {
        if (err) throw err;
    });
}
}

const compileSummary = (body: any) => {
    let html = `<h1>Order</h1>`
    for(let i = 0; i < body.length; i++) {
        html += `   <p>#############################################</p>
                    <br>
                    <p><b>Produkt:</b> ${body[i].metadata.product}</p>
                    <p><b>Material:</b> ${body[i].metadata.material}</p>
                    <p><b>Fäst metod:</b> ${body[i].metadata.application}</p>
                    <p><b>Storlek :</b> ${body[i].visual.width} x ${body[i].visual.height} </p>
                    <p><b>Form: </b> ${body[i].visual.shape}</p>
                    <br>`
    }
    
    
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
            saveProductionFiles(body)
            let attachments = []
            for(let i = 0; i < body.length; i++) {
                attachments.push(new Attachment(fs.readFileSync('file-' + i + '.svg', {encoding: 'base64'}), 'file-' + i + '.svg', 'attachment'))
            }
            let emailParams = new EmailParams()
            .setFrom("order@simonbonnedahl.dev")
            .setRecipients(recipients)
            .setAttachments(attachments)
            .setSubject("Order")
            .setHtml(compileSummary(body))
            .setText("This is the text content");

            mailersend.send(emailParams);
            res.status(200).json({ complete: true })
                
                
        default:
            res.status(200).json({ complete: true })
    }
}
