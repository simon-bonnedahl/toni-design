import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setSign } from "../../../reducers/signSlice";
import sanityDB, { urlFor } from "../../../sanity";

const Saved = () => {
  const { data: session } = useSession();
  const [signs, setSigns] = useState<any[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
  useMemo(() => {
    //fetch all signs created by user
    if (!session) return;
    const query = `*[_type == "createdSign" && creator == "${
      session!.user!.email
    }"]{
        ...,
        "imageUrl" : image.asset->url
    }`;
    sanityDB.fetch(query).then((res) => {
      setSigns(res);
    });
  }, [session]);

  const handleOpenSign = (json: string) => {
    const jsonObj = JSON.parse(json);
    dispatch(setSign({ sign: jsonObj }));
    router.push("/");
  };

  const handleRemove = (sign: any) => {
    sanityDB.delete(sign._id).then((res) => {
      setSigns(signs.filter((s) => s._id !== sign._id));
      toast.info("Skylten har tagits bort");
    });
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Sparade skyltar</h1>
      <div className="grid grid-cols-4 gap-4">
        {signs.length === 0 && (
          <div className="col-span-4 flex flex-col items-center justify-center">
            <h2 className="">Du har inga sparade skyltar</h2>
            <p className="text-center">
              Du kan spara skyltar genom att klicka på Spara-knappen när du är
              inne i skyltredigeraren
            </p>
          </div>
        )}
        {signs.map((sign, key) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-md border border-primary p-4"
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
