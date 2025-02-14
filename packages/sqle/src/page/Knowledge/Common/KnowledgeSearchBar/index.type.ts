import useKnowledgeSearchBar from './hooks/useKnowledgeSearchBar';

export interface KnowledgeSearchBarProps
  extends Partial<ReturnType<typeof useKnowledgeSearchBar>> {
  onSearch?: (params: { searchText: string; selectedTags?: string[] }) => void;
  allowSelectTag?: boolean;
  allowSearchEmptyText?: boolean;
}

export type TagSelectorBarProps = {
  value: KnowledgeSearchBarProps['selectedTags'];
  onChange: KnowledgeSearchBarProps['setSelectedTags'];
};
