import { useState } from 'react';

interface UseKnowledgeSearchBarReturn {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  enableGraphMode: boolean;
  setEnableGraphMode: (enable: boolean) => void;
}

const useKnowledgeSearchBar = (
  initialGraphMode = false
): UseKnowledgeSearchBarReturn => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [enableGraphMode, setEnableGraphMode] =
    useState<boolean>(initialGraphMode);

  return {
    searchText,
    setSearchText,
    selectedTags,
    setSelectedTags,
    enableGraphMode,
    setEnableGraphMode
  };
};

export default useKnowledgeSearchBar;
