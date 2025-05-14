import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { Dayjs } from 'dayjs';
import { updateRelateSqlListDateRange } from '../../../../store/sqlInsights';

const useRelatedSqlRedux = () => {
  const dispatch = useDispatch();
  const relateSqlListDateRange = useSelector(
    (state: IReduxState) => state.sqlInsights.relateSqlList.selectedDateRange
  );

  const update = (dateRange: [Dayjs, Dayjs] | null) => {
    dispatch(updateRelateSqlListDateRange({ dateRange }));
  };

  return {
    relateSqlListDateRange,
    updateRelateSqlListDateRange: update
  };
};

export default useRelatedSqlRedux;
