import { useState } from 'react';

interface UseKnowledgeSearchBarReturn {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const useKnowledgeSearchBar = (): UseKnowledgeSearchBarReturn => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return {
    searchText,
    setSearchText,
    selectedTags,
    setSelectedTags
  };
};

export default useKnowledgeSearchBar;
