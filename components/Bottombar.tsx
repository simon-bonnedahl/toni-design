import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../reducers/editorSlice";
import { getSignJSON, getSignMetadata } from "../reducers/signSlice";

const Bottombar: React.FC = () => {
  const price = useSelector(getSignMetadata).price;
  const json = useSelector(getSignJSON);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);

  const Recipient = require("mailersend").Recipient;
  const EmailParams = require("mailersend").EmailParams;
  const MailerSend = require("mailersend");

  const mailersend = new MailerSend({
    api_key:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDhkYTA1MzBjM2ExYTkzNTllNGI1MzhjYzA5NzcwYTgyMGZhYjZmMzc3YzYxYTAwOTgzODIxN2NhMjQ4YWU1ZDA0YWMxY2VkZDhjMDMzY2QiLCJpYXQiOjE2NzI2MDIyNDkuNzMzNDM2LCJuYmYiOjE2NzI2MDIyNDkuNzMzNDM4LCJleHAiOjQ4MjgyNzU4NDkuNzI4MzY5LCJzdWIiOiI1MTUwNiIsInNjb3BlcyI6WyJlbWFpbF9mdWxsIiwiZG9tYWluc19mdWxsIiwiYWN0aXZpdHlfZnVsbCIsImFuYWx5dGljc19mdWxsIiwidG9rZW5zX2Z1bGwiLCJ3ZWJob29rc19mdWxsIiwidGVtcGxhdGVzX2Z1bGwiLCJzdXBwcmVzc2lvbnNfZnVsbCIsInNtc19mdWxsIiwiZW1haWxfdmVyaWZpY2F0aW9uX2Z1bGwiLCJpbmJvdW5kc19mdWxsIiwicmVjaXBpZW50c19mdWxsIl19.fxXUkqpP1GVl-AqPr7kozFV2iIbjQGy8AQA2PtZI9HjInTv-P0FU3j_s3AzRsYgAUYDdy7ZS1ZuGvcH6lx3IKMC3kLev4bqjYnwX50vHriML_a0a4GGe0MBGxr8lA33oIgRCwE4TIK7ZjwCPUv_nDEgW6ndWjEkldXH-_dwrMriIGKKzacGoKXKjTGTkR6LEoBDgRg-Y8oLN82Oy6Q05hTORrYt_5sIYWITa8UY2uW-8MJeYo8j9kMGAZa7lNWQ973PoCJqefQQWGQl2ERcxQXWmwFr7_Kdz9aYOV5vyCQPt0Bfzad4eYHEYjg3Zf_uVZhyaPRI6CD-6h4NAHadi4GQ66sTG4NYMblM93l3pgh_sePer55b8VXAuQ1LJGFE2KQmXlAei0jPUgxEGLmEezb8xPtP0Z6uX_STp2KDBRyreQL-h0Hs3KKZ-9xMMbxfOjSLdofX-wUrfsaUAzb8DOY5IV9TVLrmWfo-V6K1UEamLjEHB3ZUbsjM-IYAe2nmL9FlW152QdZ3FZ46ftpsCGY3UabNZxN2scx4JdVGukdHHKRX8tIfI9n9LdzzmP_4wYcvroHXCSRKn54wlTBGfF8J3xOSytsuk5Ku501THuTgHVrKdnmI_HhzrOWHp2_FuXyJoslG5wjZYcVRJeh4jCZPyAEMKFXlbmN6x8l2AN2U",
  });

  const handleDownloadJSON = () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    var a = document.createElement("a");
    a.href = dataStr;
    a.download = "download.json";
    a.click();
  };

  const handleMailSend = () => {
    alert("Mail sent");
    const recipients = [
      new Recipient("simbo803@student.liu.se", "Your Client"),
    ];

    const emailParams = new EmailParams()
      .setFrom("conatc@simonbonnedahl.dev")
      .setFromName("Order confirmation")
      .setRecipients(recipients)
      .setSubject("Order")
      .setHtml("This is the HTML content")
      .setText("This is the text content");
    mailersend.send(emailParams);
  };

  return (
    <div className="flex flex-row w-full h-20 border items-center justify-between px-4">
      <div className="flex space-x-4">
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "SVG" }))
          }
        >
          Download SVG
        </button>
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={() =>
            dispatch(addCommand({ command: "saveSign", value: "PDF" }))
          }
        >
          Download PDF
        </button>
        <button
          className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          onClick={handleDownloadJSON}
        >
          Download JSON
        </button>
      </div>
      {/*Add to cart*/}

      <div className="flex items-center space-x-2">
        {/*Price*/}
        <div>
          <span className="font-bold text-xl">{Math.round(price)}</span> kr
        </div>
        {/*Increase and Decrease*/}
        <div className="flex items-center rounded-md">
          <button
            disabled={amount === 0}
            onClick={() => setAmount(amount - 1)}
            className="p-4 rounded-md border bg-gray-200"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faMinus} />
          </button>
          <div className="p-4">{amount}</div>
          <button
            onClick={() => setAmount(amount + 1)}
            className="p-4 rounded-md border bg-gray-200"
          >
            <FontAwesomeIcon className="w-3 h-3" icon={faPlus} />
          </button>
        </div>
        {/*Add button */}
        <div>
          <button
            onClick={handleMailSend}
            className="p-3 rounded-md bg-blue-400 text-white text-light text-sm"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
