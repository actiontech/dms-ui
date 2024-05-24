import { WaterfallListProps } from '../index.type';

export type FileExecuteModeProps = Omit<
  WaterfallListProps,
  'executeMode' | 'tableFilterInfo'
>;
