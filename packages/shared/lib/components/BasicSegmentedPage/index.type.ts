import { SegmentedProps } from 'antd';
import {
  TableFilterButtonProps,
  TableRefreshButtonProps,
  TableSearchInputProps
} from '../ActiontechTable';

export type BasicSegmentedPageOptions<T> = {
  label: React.ReactNode;
  value: T;
  content: React.ReactNode;
  extraButton?: React.ReactNode;
};

export type BasicSegmentedPageProps<T = Record<string, any>> =
  SegmentedProps & {
    renderContent: () => React.ReactNode;
    /**
     * 同ActiontechTable/Toolbar中的searchInput
     */
    searchInput?: TableSearchInputProps | false;
    /**
     * 同ActiontechTable/Toolbar中的refreshButton
     */
    refreshButton?: TableRefreshButtonProps;
    /**
     * 同ActiontechTable/Toolbar中的filterButton
     */
    filterButton?: TableFilterButtonProps<T> | false;
  };
