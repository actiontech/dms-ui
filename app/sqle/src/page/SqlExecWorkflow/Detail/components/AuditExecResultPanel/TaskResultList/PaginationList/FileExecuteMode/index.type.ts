import { PaginationListProps } from '../index.type';

export type FileExecuteModeProps = Omit<
  PaginationListProps,
  'executeMode' | 'tableFilterInfo'
>;
