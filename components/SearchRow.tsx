import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCurrent } from "../reducers/navigationSlice";

const SearchRow: React.FC<{ result: any }> = ({ result }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSetResult = () => {
    dispatch(setCurrent({ current: result.title }));
    let d = document.getElementById("searcher");
    d?.blur();
    //remove the searchfield from the window
  };

  return (
    <div
      onClick={handleSetResult}
      className="flex flex-row items-center justify-between w-fill bg-base-300 hover:cursor-pointer"
    >
      <h1>{result.title}</h1>
    </div>
  );
};

export default SearchRow;
