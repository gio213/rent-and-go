"use client";
import React from "react";
import { SearchResults } from "./SearchResult";
import { Modal } from "./Modal";

const SearchComponent = () => {
  return (
    <Modal
      type="search"
      className="max-w-3xl min-h-[500px] max-h-[600px] flex flex-col"
    >
      <SearchResults />
    </Modal>
  );
};

export default SearchComponent;
