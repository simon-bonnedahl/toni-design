import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import client from "../../sanity";
import SearchRow from "./SearchRow";

const Searcher: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const selectSearchfield = () => {
    const searchField = document.getElementById("searchfield");
    searchField?.focus();
    setSearchResults([]);
  };

  const handleSearch = (search: string) => {
    const query = `*[_type in ["product", "category"] && title match "${search}*"]`;

    client.fetch(query).then((data: any) => {
      setSearchResults(data);
    });
  };

  return (
    <div className="dropdown" onClick={selectSearchfield}>
      <label
        id="searcher"
        tabIndex={0}
        className="btn-ghost btn m-1 flex space-x-2"
      >
        <div className="flex space-x-2">
          <FontAwesomeIcon className="scale-110" icon={faSearch} />
          <span>Sök</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact -right-24 w-[40vw] border border-neutral bg-base-100 p-2 shadow"
      >
        <div className="flex items-center justify-between">
          <input
            id="searchfield"
            type="text"
            placeholder="Sök"
            className="input w-11/12"
            autoComplete="off"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="flex w-1/12 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {/*Search results*/}
        <div className="flex max-h-96 flex-col space-y-2 overflow-y-scroll">
          {searchResults.map((result, key) => (
            <SearchRow key={key} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Searcher;
