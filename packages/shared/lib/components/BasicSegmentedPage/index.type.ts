import { SegmentedProps } from 'antd';

export type BasicSegmentedPageOptions<T> = {
  label: React.ReactNode;
  value: T;
  content: React.ReactNode;
  extraButton?: React.ReactNode;
};

export type BasicSegmentedPageProps = SegmentedProps & {
  renderContent: () => React.ReactNode;
};
