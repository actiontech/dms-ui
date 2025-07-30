import {
  BasicRangePickerProps,
  PageHeader,
  CustomSelect
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space, Spin } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useInstance from '../../hooks/useInstance';
import {
  BasicSelect,
  BasicRangePicker,
  BasicSegmented,
  EmptyBox,
  useTypedNavigate
} from '@actiontech/shared';
import dayjs, { Dayjs } from 'dayjs';
import DataSourcePerformanceTrend from './components/DataSourcePerformanceTrend';
import {
  DateRangeEnum,
  DateRangeOptions,
  AutoRefreshIntervalEnum,
  AutoRefreshIntervalOptions
} from './index.data';
import { SegmentedValue } from 'antd/es/segmented';
import SlowSqlTrend from './components/SlowSqlTrend';
import TopSqlTrend from './components/TopSqlTrend';
import ActiveSessionTrend from './components/ActiveSessionTrend';
import RelatedSqlList from './components/RelatedSqlList';
import DrawerManager from './components/DrawerManager';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { range } from 'lodash';
import { SegmentedStyleWrapper, SqlInsightsStyleWrapper } from './style';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useDateRange from './hooks/useDateRange';

const SqlInsights: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const navigate = useTypedNavigate();
  const [selectedInstance, setSelectedInstance] = useState<string>();

  const {
    dateRange,
    setDateRange,
    timePeriod,
    setTimePeriod,
    autoRefreshInterval,
    setAutoRefreshInterval,
    getDataRange
  } = useDateRange();

  const {
    updateInstanceList,
    loading: getInstanceListLoading,
    instanceIDOptions,
    instanceList
  } = useInstance();

  const instanceInfo = useMemo(() => {
    return instanceList.find((item) => item.instance_id === selectedInstance);
  }, [selectedInstance, instanceList]);

  const onCreateSqlManagementConf = () => {
    navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create, {
      params: {
        projectID
      },
      queries: {
        instance_id: selectedInstance,
        environment_tag: instanceInfo?.environment_tag_name
      }
    });
  };

  useEffect(() => {
    if (projectName) {
      updateInstanceList(
        { project_name: projectName },
        {
          onSuccess: (data) => {
            if (data.length > 0) {
              setSelectedInstance(data[0].instance_id);
            }
          }
        }
      );
    }
  }, [projectName, updateInstanceList]);

  const handleInstanceChange = useCallback((value: string) => {
    setSelectedInstance(value);
  }, []);

  const handleDateRangeChange = useCallback<
    Required<BasicRangePickerProps>['onChange']
  >(
    (dates) => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]]);
      }
    },
    [setDateRange]
  );

  const onRefresh = () => {
    eventEmitter.emit(EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH);
  };

  const onSegmentedChange = useCallback(
    (value: SegmentedValue) => {
      setTimePeriod(value as DateRangeEnum);
      if (value !== DateRangeEnum['custom']) {
        const [startTime, endTime] = getDataRange(value as DateRangeEnum);
        setDateRange([startTime, endTime]);
      }
    },
    [getDataRange, setDateRange, setTimePeriod]
  );

  const handleAutoRefreshIntervalChange = useCallback(
    (value: AutoRefreshIntervalEnum) => {
      setAutoRefreshInterval(value);
    },
    [setAutoRefreshInterval]
  );

  const disabledTime = (date: Dayjs | null) => {
    const currentTime = dayjs();
    if (date && date.isSame(currentTime, 'day')) {
      const hours = currentTime?.hour() ?? 0;
      const minutes = currentTime?.minute() ?? 0;
      const seconds = currentTime?.second() ?? 0;

      const disabledConfig = {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: (selectedHour: number) =>
          selectedHour === hours ? range(minutes + 1, 60) : [],
        disabledSeconds: (selectedHour: number, selectedMinute: number) =>
          selectedHour === hours && selectedMinute === minutes
            ? range(seconds + 1, 60)
            : []
      };

      return disabledConfig;
    }
    return {};
  };

  return (
    <>
      <PageHeader
        fixed
        title={t('sqlInsights.title')}
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
              size="small"
              className="instance-select"
            />
          </Space>
        }
      />
      <Spin spinning={getInstanceListLoading}>
        <SegmentedStyleWrapper size={12}>
          <Space>
            <BasicSegmented
              value={timePeriod}
              options={DateRangeOptions}
              onChange={onSegmentedChange}
            />
            <EmptyBox if={timePeriod === DateRangeEnum['custom']}>
              <BasicRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                allowClear={false}
                disabledDate={(current) =>
                  current && current > dayjs().endOf('day')
                }
                showTime={{
                  defaultValue: [
                    dayjs('00:00:00', 'HH:mm:ss'),
                    dayjs('00:00:00', 'HH:mm:ss')
                  ]
                }}
                disabledTime={disabledTime}
              />
            </EmptyBox>
          </Space>
          <Space size={12}>
            <CustomSelect
              value={autoRefreshInterval}
              onChange={handleAutoRefreshIntervalChange}
              options={AutoRefreshIntervalOptions}
              style={{ width: 200 }}
              size="small"
              prefix={t('sqlInsights.autoRefreshTimeGap')}
              allowClear={false}
              className="auto-refresh-interval-select"
            />
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        </SegmentedStyleWrapper>

        <SqlInsightsStyleWrapper>
          <DataSourcePerformanceTrend
            instanceId={selectedInstance}
            dateRange={dateRange}
            pollingInterval={autoRefreshInterval}
            timePeriod={timePeriod}
          />
          <SlowSqlTrend
            instanceId={selectedInstance}
            dateRange={dateRange}
            pollingInterval={autoRefreshInterval}
            onCreateSqlManagementConf={onCreateSqlManagementConf}
            timePeriod={timePeriod}
          />
          <TopSqlTrend
            instanceId={selectedInstance}
            dateRange={dateRange}
            pollingInterval={autoRefreshInterval}
            onCreateSqlManagementConf={onCreateSqlManagementConf}
            timePeriod={timePeriod}
          />
          <ActiveSessionTrend
            instanceId={selectedInstance}
            dateRange={dateRange}
            pollingInterval={autoRefreshInterval}
            onCreateSqlManagementConf={onCreateSqlManagementConf}
            timePeriod={timePeriod}
          />
          <RelatedSqlList instanceId={selectedInstance} />
        </SqlInsightsStyleWrapper>
      </Spin>
      <DrawerManager />
    </>
  );
};

export default SqlInsights;
