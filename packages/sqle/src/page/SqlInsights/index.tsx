import { BasicRangePickerProps, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useInstance from '../../hooks/useInstance';
import {
  BasicSelect,
  BasicRangePicker,
  BasicSegmented
} from '@actiontech/shared';
import { EmptyRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import dayjs, { Dayjs } from 'dayjs';
import DataSourcePerformanceTrend from './components/DataSourcePerformanceTrend';
import { DateRangeEnum, DateRangeOptions } from './index.data';
import { SegmentedValue } from 'antd/es/segmented';
import SlowSqlTrend from './components/SlowSqlTrend';
import TopSqlTrend from './components/TopSqlTrend';
import ActiveSessionTrend from './components/ActiveSessionTrend';
import RelatedSqlList from './components/RelatedSqlList';
import DrawerManager from './components/DrawerManager';
const SqlInsights: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [selectedInstance, setSelectedInstance] = useState<string>();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [timePeriod, setTimePeriod] = useState<DateRangeEnum>(
    DateRangeEnum['7D']
  );

  const onRefresh = () => {
    console.log('onRefresh');
  };

  const {
    updateInstanceList,
    loading: getInstanceListLoading,
    instanceIDOptions
  } = useInstance();

  useEffect(() => {
    if (projectName) {
      updateInstanceList({ project_name: projectName });
    }
  }, [projectName, updateInstanceList]);

  const handleInstanceChange = useCallback((value: string) => {
    setSelectedInstance(value);
  }, []);

  const handleDateRangeChange = useCallback<
    Required<BasicRangePickerProps>['onChange']
  >((dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  }, []);

  const onSegmentedChange = useCallback((value: SegmentedValue) => {
    setTimePeriod(value as DateRangeEnum);
    let startTime = dayjs();
    const endTime = dayjs();

    if (value === DateRangeEnum['24H']) {
      startTime = endTime.subtract(24, 'hour');
    } else if (value === DateRangeEnum['7D']) {
      startTime = endTime.subtract(7, 'day');
    } else if (value === DateRangeEnum['30D']) {
      startTime = endTime.subtract(30, 'day');
    }

    setDateRange([startTime, endTime]);
  }, []);

  return (
    <>
      <PageHeader
        title={
          <Space size={12}>
            {t('sqlInsights.title')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={
          <Space>
            <BasicSelect
              placeholder={t('common.form.placeholder.select', {
                name: t('sqlInsights.dataSourceSelect')
              })}
              value={selectedInstance}
              onChange={handleInstanceChange}
              loading={getInstanceListLoading}
              options={instanceIDOptions}
              style={{ width: 240 }}
            />
          </Space>
        }
      />
      <EmptyRowStyleWrapper>
        <Space size={12}>
          <span>{t('sqlInsights.dateRange')}:</span>
          <BasicRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            allowClear={false}
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current > dayjs().endOf('day')
            }
          />
          <BasicSegmented
            value={timePeriod}
            options={DateRangeOptions}
            onChange={onSegmentedChange}
          />
        </Space>
      </EmptyRowStyleWrapper>

      <DataSourcePerformanceTrend
        instanceId={selectedInstance}
        dateRange={dateRange}
      />
      <SlowSqlTrend instanceId={selectedInstance} dateRange={dateRange} />
      <TopSqlTrend instanceId={selectedInstance} dateRange={dateRange} />
      <ActiveSessionTrend instanceId={selectedInstance} dateRange={dateRange} />
      <RelatedSqlList instanceId={selectedInstance} />
      <DrawerManager />
    </>
  );
};

export default SqlInsights;
