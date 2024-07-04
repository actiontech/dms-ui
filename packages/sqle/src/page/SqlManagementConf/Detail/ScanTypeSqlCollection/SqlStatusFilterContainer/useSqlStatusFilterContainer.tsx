import { CustomSegmentedFilterProps } from '@actiontech/shared/lib/components/CustomSegmentedFilter/index.type';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

const useSqlStatusFilterContainer = () => {
  const [sqlStatusFilterValue, handleChangeSqlStatus] = useState('all');
  const auditAction = useCallback(() => {
    console.log('on audit action');
  }, []);

  const lastAuditTime = dayjs().toString();

  const options: CustomSegmentedFilterProps['options'] = [
    {
      label: (
        <div className="sql-status-filter-item-wrapper">
          <span className="sql-status-filter-number">2048</span>
          <span className="sql-status-filter-text">全部SQL</span>
        </div>
      ),
      value: 'all'
    },
    {
      label: (
        <div className="sql-status-filter-item-wrapper">
          <span className="sql-status-filter-number">1000</span>
          <span className="sql-status-filter-text">未解决</span>
        </div>
      ),
      value: '1'
    },
    {
      label: (
        <div className="sql-status-filter-item-wrapper">
          <span className="sql-status-filter-number">1000</span>
          <span className="sql-status-filter-text">已解决</span>
        </div>
      ),
      value: '2'
    },
    {
      label: (
        <div className="sql-status-filter-item-wrapper">
          <span className="sql-status-filter-number">48</span>
          <span className="sql-status-filter-text">已忽略</span>
        </div>
      ),
      value: '3'
    }
  ];

  return {
    sqlStatusFilterValue,
    handleChangeSqlStatus,
    sqlStatusFilterOptions: options,
    auditAction,
    lastAuditTime
  };
};

export default useSqlStatusFilterContainer;
