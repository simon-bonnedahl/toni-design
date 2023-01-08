const SearchRow: React.FC<{ result: any }> = ({ result }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1>{result.title}</h1>
    </div>
  );
};

export default SearchRow;
