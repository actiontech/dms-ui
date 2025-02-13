import { useState } from 'react';

const useSearchState = (initSearchGraph = true) => {
  const [keywords, setKeywords] = useState<string>();
  const [tags, setTags] = useState<string[]>();
  const [searchGraph, setSearchGraph] = useState<boolean>(initSearchGraph);
  return {
    keywords,
    setKeywords,
    tags,
    setTags,
    searchGraph,
    setSearchGraph
  };
};

export default useSearchState;
