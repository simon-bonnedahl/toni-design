/* eslint @typescript-eslint/no-var-requires: "off" */
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addCommand } from "../../../reducers/editorSlice";

import client from "../../../sanity";
const { v4: uuidv4 } = require("uuid");
const Imagedropdown: React.FC = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file);
      const imgId = uuidv4();
      client.assets
        .upload("image", file, {
          contentType: file.type,
          filename: file.name,
        })
        .then((document) => {
          const doc = {
            _type: "asset",
            id: imgId,
            url: {
              _type: "image",
              asset: {
                _ref: document._id,
              },
            },
          };
          client.create(doc).then(() => {
            console.log("Document created", doc);
            setImage({
              type: file.type,
              imgId: imgId,
            });
          });
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    }
  };
  useEffect(() => {
    console.log(image);
    if (image)
      dispatch(
        addCommand({
          command: "addImage",
          value: { imageType: image.type, imageId: image.imgId },
        })
      );
  }, [image, dispatch]);

  return (
    <div className="dropdown">
      <label
        onClick={() => dispatch(addCommand({ command: "closeCart" }))}
        tabIndex={0}
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Bild</p>
        <FontAwesomeIcon icon={faImage} className="scale-110" />
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