import { useRequest } from 'ahooks';
import { Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiHubService } from '@actiontech/shared/lib/api/sqle';
import {
  AiPerformanceEngineOutlined,
  AiSmartCorrectionOutlined,
  ExecutionDataOutlined
} from '@actiontech/icons';
import CardWrapper from '../../../../../components/CardWrapper';
import EmitterKey from '../../../../../data/EmitterKey';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import eventEmitter from '../../../../../utils/EventEmitter';
import ModuleTitle from '../ModuleTitle';
import { ExecutionDataStyleWrapper } from './style';
import {
  AIHubExecutionRecordFunctionModuleEnum,
  AIHubExecutionRecordProcessStatusEnum,
  AIHubExecutionRecordValueDimensionEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ActiontechTable } from '@actiontech/dms-kit';

const DISPLAY_ROW_COUNT = 6;
const SCROLL_INTERVAL_MS = 2000;

const ExecutionData: React.FC = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [scrollStartIndex, setScrollStartIndex] = useState(0);

  const {
    data: executionData,
    loading,
    run: refresh
  } = useRequest(() => {
    return AiHubService.GetAIHubExecutionData().then((res) => {
      return res.data;
    });
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Report_Statistics,
      () => refresh()
    );
    return unsubscribe;
  }, [refresh]);

  const list = useMemo(() => executionData?.data || [], [executionData?.data]);
  const needScroll = list.length > DISPLAY_ROW_COUNT;

  const visibleData = useMemo(() => {
    if (list.length <= DISPLAY_ROW_COUNT) return list;
    return Array.from({ length: DISPLAY_ROW_COUNT }, (_, i) => {
      const index = (scrollStartIndex + i) % list.length;
      return list[index];
    });
  }, [list, scrollStartIndex]);

  useEffect(() => {
    if (!needScroll || list.length === 0) return;
    const timer = setInterval(() => {
      setScrollStartIndex((prev) => (prev + 1) % list.length);
    }, SCROLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [needScroll, list.length]);

  const valueDimensionDisplayTextMap: Record<string, string> = {
    [AIHubExecutionRecordValueDimensionEnum.security]: t(
      'reportStatistics.aiGovernance.executionData.valueDimension.security'
    ),
    [AIHubExecutionRecordValueDimensionEnum.performance]: t(
      'reportStatistics.aiGovernance.executionData.valueDimension.performance'
    ),
    [AIHubExecutionRecordValueDimensionEnum.correction]: t(
      'reportStatistics.aiGovernance.executionData.valueDimension.correction'
    ),
    [AIHubExecutionRecordValueDimensionEnum.maintenance]: t(
      'reportStatistics.aiGovernance.executionData.valueDimension.maintenance'
    ),
    [AIHubExecutionRecordValueDimensionEnum.code_standard]: t(
      'reportStatistics.aiGovernance.executionData.valueDimension.codeStandard'
    )
  };

  const processStatusDisplayTextMap: Record<string, string> = {
    [AIHubExecutionRecordProcessStatusEnum.pending]: t(
      'reportStatistics.aiGovernance.executionData.processStatus.pending'
    ),
    [AIHubExecutionRecordProcessStatusEnum.running]: t(
      'reportStatistics.aiGovernance.executionData.processStatus.running'
    ),
    [AIHubExecutionRecordProcessStatusEnum.completed]: t(
      'reportStatistics.aiGovernance.executionData.processStatus.completed'
    ),
    [AIHubExecutionRecordProcessStatusEnum.failed]: t(
      'reportStatistics.aiGovernance.executionData.processStatus.failed'
    )
  };

  const processStatusColorMap: Record<string, string> = {
    [AIHubExecutionRecordProcessStatusEnum.pending]:
      sqleTheme.reportStatistics.ExecutionData.processStatus.pending,
    [AIHubExecutionRecordProcessStatusEnum.running]:
      sqleTheme.reportStatistics.ExecutionData.processStatus.running,
    [AIHubExecutionRecordProcessStatusEnum.completed]:
      sqleTheme.reportStatistics.ExecutionData.processStatus.completed,
    [AIHubExecutionRecordProcessStatusEnum.failed]:
      sqleTheme.reportStatistics.ExecutionData.processStatus.failed
  };

  const columns = [
    {
      title: t(
        'reportStatistics.aiGovernance.executionData.columns.sourceProject'
      ),
      dataIndex: 'source_project',
      key: 'source_project',
      width: 260
    },
    {
      title: t(
        'reportStatistics.aiGovernance.executionData.columns.sqlSnippet'
      ),
      dataIndex: 'sql_snippet',
      key: 'sql_snippet',
      width: 260,
      onCell: () => ({
        style: {
          width: 260,
          minWidth: 260,
          maxWidth: 260
        }
      }),
      render: (value: string) => {
        const content = value || '-';
        return (
          <Tooltip title={content}>
            <span
              style={{
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {content}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: t(
        'reportStatistics.aiGovernance.executionData.columns.functionModule'
      ),
      dataIndex: 'function_module',
      key: 'function_module',
      render: (value: AIHubExecutionRecordFunctionModuleEnum) => {
        let displayValue = value;
        let tagStyle: React.CSSProperties | undefined;
        let moduleIcon: JSX.Element | null = null;
        if (value === AIHubExecutionRecordFunctionModuleEnum.smart_correction) {
          displayValue = t(
            'reportStatistics.aiGovernance.executionData.functionModule.smartCorrection'
          );
          moduleIcon = <AiSmartCorrectionOutlined />;
          tagStyle = {
            color:
              sqleTheme.reportStatistics.ExecutionData.functionModuleTag
                .smartCorrection.color,
            backgroundColor:
              sqleTheme.reportStatistics.ExecutionData.functionModuleTag
                .smartCorrection.bgColor
          };
        }
        if (
          value === AIHubExecutionRecordFunctionModuleEnum.performance_engine
        ) {
          displayValue = t(
            'reportStatistics.aiGovernance.executionData.functionModule.performanceEngine'
          );
          moduleIcon = <AiPerformanceEngineOutlined />;
          tagStyle = {
            color:
              sqleTheme.reportStatistics.ExecutionData.functionModuleTag
                .performanceEngine.color,
            backgroundColor:
              sqleTheme.reportStatistics.ExecutionData.functionModuleTag
                .performanceEngine.bgColor
          };
        }
        return (
          <Tag style={tagStyle}>
            <span className="execution-module-tag-content">
              {moduleIcon}
              {displayValue || '-'}
            </span>
          </Tag>
        );
      }
    },
    {
      title: t(
        'reportStatistics.aiGovernance.executionData.columns.valueDimension'
      ),
      dataIndex: 'value_dimension',
      key: 'value_dimension',
      render: (value: AIHubExecutionRecordValueDimensionEnum) => (
        <span className="execution-value-dimension-wrapper">
          <Tag>{valueDimensionDisplayTextMap[value] || value || '-'}</Tag>
        </span>
      )
    },
    {
      title: t(
        'reportStatistics.aiGovernance.executionData.columns.processStatus'
      ),
      dataIndex: 'process_status',
      key: 'process_status',
      render: (value: AIHubExecutionRecordProcessStatusEnum) => {
        const text = processStatusDisplayTextMap[value] || value || '-';
        const color = processStatusColorMap[value];
        if (!color) {
          return (
            <span className="execution-process-status-wrapper">{text}</span>
          );
        }
        return (
          <span className="execution-process-status-wrapper">
            <span className="execution-process-status" style={{ color }}>
              <span
                className="execution-process-status-dot"
                style={{ backgroundColor: color }}
              />
              {text}
            </span>
          </span>
        );
      }
    },
    {
      title: t('reportStatistics.aiGovernance.executionData.columns.time'),
      dataIndex: 'operation_time',
      key: 'operation_time',
      render: (value: string) => value || '-'
    }
  ];

  return (
    <ExecutionDataStyleWrapper>
      <div className="execution-data-header">
        <ModuleTitle
          icon={<ExecutionDataOutlined />}
          title={t('reportStatistics.aiGovernance.executionData.moduleTitle')}
          description={t(
            'reportStatistics.aiGovernance.executionData.moduleDesc'
          )}
        />
      </div>
      <CardWrapper title="" enabledLoading={loading}>
        <ActiontechTable
          columns={columns}
          dataSource={visibleData}
          rowKey={(record, index) =>
            `${record.id?.toString() || 'row'}-${index}`
          }
          loading={loading}
          pagination={false}
          size="small"
        />
      </CardWrapper>
    </ExecutionDataStyleWrapper>
  );
};

export default ExecutionData;
