import { SegmentedProps } from 'antd';
import { TableSearchInputProps } from '../ActiontechTable';

export type BasicSegmentedPageOptions<T> = {
  label: React.ReactNode;
  value: T;
  content: React.ReactNode;
  extraButton?: React.ReactNode;
};

export type BasicSegmentedPageProps = SegmentedProps & {
  renderContent: () => React.ReactNode;
  /**
   * 同ActiontechTable/Toolbar中的searchInput
   */
  searchInput?: TableSearchInputProps | false;
};
