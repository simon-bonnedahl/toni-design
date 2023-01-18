import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../reducers/navigationSlice";
import { urlFor } from "../../sanity";

const SearchRow: React.FC<{ result: any }> = ({ result }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSetResult = () => {
    if (result._type === "product") {
      router.push({ pathname: "/product", query: { id: result._id } });
    }
    if (result._type === "category") {
      dispatch(setSelectedCategory({ category: result.title }));
      router.push("/collections");
    }
  };

  return (
    <div
      onClick={handleSetResult}
      className="w-fillbg-base-300 flex flex-row hover:cursor-pointer"
    >
      <div className="jusitfy-center flex h-40 w-40 items-center rounded-md border border-neutral p-2">
        {result.image && (
          <Image
            src={urlFor(result.image).height(100).url()}
            alt="Result image"
            width={200}
            height={100}
          />
        )}
      </div>
      <div className="flex flex-col p-4">
        <h1>{result.title}</h1>
      </div>
    </div>
  );
};

export default SearchRow;
