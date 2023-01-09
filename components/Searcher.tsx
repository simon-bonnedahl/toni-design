import { useState } from "react";
import client from "../sanity";
import SearchRow from "./SearchRow";

const Searcher: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const selectSearchfield = () => {
    let searchField = document.getElementById("searchfield");
    searchField?.focus();
    setSearchResults([]);
  };

  const handleSearch = (search: string) => {
    let results: any[] = [];
    let query = `*[_type == 'product' && title match "${search}*"]`;

    client.fetch(query).then((data: any) => {
      setSearchResults(results.concat(data));
    });

    query = `*[_type == 'category' && title match "${search}*"]`;

    client.fetch(query).then((data: any) => {
      setSearchResults(results.concat(data));
    });

    console.log(searchResults);
    //console.log(results);
  };

  return (
    <div className="dropdown" onClick={selectSearchfield}>
      <label
        id="searcher"
        tabIndex={0}
        className="btn btn-ghost m-1 flex space-x-2"
      >
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
      </label>
      <div
        tabIndex={0}
        className="dropdown-content -right-24 card w-[40vw] border border-neutral card-compact bg-base-100 p-2 shadow"
      >
        <div className="flex items-center justify-between">
          <input
            id="searchfield"
            type="text"
            placeholder="Sök"
            className="input w-11/12"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="w-1/12 flex items-center justify-center">
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
        <div className="flex flex-col">
          {searchResults.map((result, key) => (
            <SearchRow key={key} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Searcher;
