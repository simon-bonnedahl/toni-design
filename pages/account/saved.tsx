import { faCross, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sign } from "crypto";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setInfo } from "../../reducers/alertSlice";
import { addCommand, clearCommands } from "../../reducers/editorSlice";
import { setSign } from "../../reducers/signSlice";
import client, { urlFor } from "../../sanity";

const Saved = () => {
  const { data: session } = useSession();
  const [signs, setSigns] = useState<any[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
  useMemo(() => {
    //fetch all signs created by user
    if (!session) return;
    let query = `*[_type == "createdSign" && creator == "${
      session!.user!.email
    }"]{
        ...,
        "imageUrl" : image.asset->url
    }`;
    client.fetch(query).then((res) => {
      setSigns(res);
    });
  }, [session]);

  const handleOpenSign = (json: string) => {
    let jsonObj = JSON.parse(json);
    dispatch(clearCommands());
    dispatch(setSign({ sign: jsonObj }));
    dispatch(addCommand({ command: "reCreate", value: jsonObj.visual }));
    router.push("/");
  };

  const handleRemove = (sign: any) => {
    client.delete(sign._id).then((res) => {
      setSigns(signs.filter((s) => s._id !== sign._id));
      dispatch(setInfo("Skylten togs bort!"));
    });
  };

  return (
    <div className="overflow-y-scroll">
      <h1 className="text-2xl font-bold">Sparade skyltar</h1>
      <div className="grid grid-cols-4 gap-4">
        {signs.map((sign, key) => (
          <div
            key={key}
            className="border border-primary flex flex-col items-center p-4 rounded-md"
          >
            <Image
              src={urlFor(sign.imageUrl).height(200).width(300).url()}
              alt="sign"
              width={300}
              height={200}
            />
            <button
              className="btn btn-warning mt-2 w-48"
              onClick={() => handleOpenSign(sign.json)}
            >
              Anpassa
              <FontAwesomeIcon
                className="text-content-info ml-2"
                icon={faPen}
              />
            </button>
            <button
              className="btn btn-error mt-2 w-48"
              onClick={() => handleRemove(sign)}
            >
              Ta bort
              <FontAwesomeIcon
                className="text-content-info ml-2"
                icon={faTrash}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;
