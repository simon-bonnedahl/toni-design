import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setSelectedOption } from "../../reducers/toolbarSlice";
import { addCommand } from "../../reducers/editorSlice";
import client, { urlFor } from "../../sanity";
const { v4: uuidv4 } = require("uuid");

const ImageModal: React.FC = () => {
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
    handleClose();
  };

  const handleClose = () => {
    dispatch(setSelectedOption({ selectedOption: null }));
  };

  return (
    <div className="absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg">
      <div
        className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300"
        onClick={() => handleClose()}
      >
        <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff" />
      </div>
      <div className="flex flex-col w-8/12 p-5 space-y-2">
        <label htmlFor="image-input">Upload Image:</label>
        <input
          type="file"
          id="image-input"
          accept=".jpg, .jpeg, .png, .webp, .svg"
          onChange={handleImageUpload}
        />
        <button
          disabled={!image}
          onClick={() => handleAddImage()}
          className="ml-2 p-2 px-4 w-fit text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
