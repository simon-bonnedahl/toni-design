import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";

import client from "../../sanity";
const { v4: uuidv4 } = require("uuid");
const Imagedropdown: React.FC = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      let imgId = uuidv4();
      client.assets
        .upload("image", file, {
          contentType: file.type,
          filename: file.name,
        })
        .then((document) => {
          console.log(document);
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

  const handleAddImage = () => {
    if (image)
      dispatch(
        addCommand({
          command: "addImage",
          value: { imageType: image.type, imageId: image.imgId },
        })
      );
    setImage(null);
  };

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn btn-primary btn-outline m-1 flex space-x-2"
      >
        <p className="text-content-primary">Bild</p>
        <FontAwesomeIcon icon={faImage} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-80 card-compact bg-neutral p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Lägg till en bild</h3>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            accept=".jpg, .jpeg, .png, .webp, .svg"
            onChange={handleImageUpload}
          />
          <button
            onClick={handleAddImage}
            className="btn btn-primary w-fill mt-4"
            disabled={!image}
          >
            Lägg till
          </button>
        </div>
      </div>
    </div>
  );
};

export default Imagedropdown;