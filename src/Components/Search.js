import React, { useState } from "react";
import "./Search.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  const debounceSearch = (callBack, delay) => {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callBack.apply(context, args), delay);
    };
  };

  const handleDebounceSearch = debounceSearch(onSearch, 500);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Name, Email, or Role..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleDebounceSearch(e.target.value); // Removed the direct invocation here
        }}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default SearchBar;
