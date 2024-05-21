import { TaskResultListLayoutEnum } from '../index.enum';
import PaginationList from './PaginationList';
import { PaginationListProps } from './PaginationList/index.type';
import WaterfallList from './WaterfallList';
import { WaterfallListProps } from './WaterfallList/index.type';

const TaskResultList: React.FC<WaterfallListProps & PaginationListProps> = ({
  currentListLayout,
  ...props
}) => {
  return currentListLayout === TaskResultListLayoutEnum.scroll ? (
    <WaterfallList currentListLayout={currentListLayout} {...props} />
  ) : (
    <PaginationList currentListLayout={currentListLayout} {...props} />
  );
};

export default TaskResultList;
