import { ReactNode } from 'react';

import { ColumnIndexStyleWrapper } from './style';

interface IColumnIndex {
  index: number;
  children: string | ReactNode;
}

const ColumnIndex = (props: IColumnIndex) => {
  const { index, children } = props;
  return (
    <ColumnIndexStyleWrapper>
      <span className="index-box">{index}</span>
      <span>{children}</span>
    </ColumnIndexStyleWrapper>
  );
};

export default ColumnIndex;
