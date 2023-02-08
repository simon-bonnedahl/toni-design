/* eslint @typescript-eslint/no-var-requires: "off" */
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addCommand } from "../../../../reducers/editorSlice";

import client, { urlFor } from "../../../../sanity";
import { Image, Sign } from "../../../types/sign.d";
const { v4: uuidv4 } = require("uuid");

type Props = {
  sign: Sign;
  addImage: (image: Image) => void;
};

const Imagedropdown: React.FC<Props> = ({ sign, addImage }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const id = uuidv4();
      client.assets
        .upload("image", file, {
          contentType: file.type,
          filename: file.name,
        })
        .then((document) => {
          const doc = {
            _type: "asset",
            id: id,
            url: {
              _type: "image",
              asset: {
                _ref: document._id,
              },
            },
          };
          client.create(doc).then(() => {
            //console.log("Document created", doc);
            addImage({
              type: file.type,
              url: urlFor(doc.url.asset._ref).url(),
              id: id,
            });
          });
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    }
  };

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn-outline btn-primary btn m-1 p-4">
        <FontAwesomeIcon icon={faImage} className="scale-150" />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-80 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Lägg till en bild</h3>
          <p className="text-neutral-content">
            Du kan endast använda dig av bilder i vektoriserat fil-format
          </p>
          <input
            type="file"
            className="file-input-bordered file-input-primary file-input w-full max-w-xs"
            accept=".svg"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default Imagedropdown;
