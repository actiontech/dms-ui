import { ListLayoutEnum } from '../../Common/ListLayoutSelector/index.types';
import PaginationList from './PaginationList';
import { PaginationListProps } from './PaginationList/index.type';
import WaterfallList from './WaterfallList';
import { WaterfallListProps } from './WaterfallList/index.type';

const TaskResultList: React.FC<WaterfallListProps & PaginationListProps> = ({
  currentListLayout,
  ...props
}) => {
  return currentListLayout === ListLayoutEnum.scroll ? (
    <WaterfallList currentListLayout={currentListLayout} {...props} />
  ) : (
    <PaginationList currentListLayout={currentListLayout} {...props} />
  );
};

export default TaskResultList;
