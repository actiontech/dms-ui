import { SqlFileStatementOverviewStyleWrapper } from './style';
import SqlStatementResultTable from '../Common/SqlStatementResultTable';
import {
  TableFilterButton,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import useStaticStatus from '../../../../../../../hooks/useStaticStatus';
import useAuditResultFilterParams from '../../../../../Common/AuditResultFilterContainer/useAuditResultFilterParams';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditTaskExtraFilterMeta } from '../../index.data';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { GetAuditTaskSQLsPrams } from '../../index.type';
import {
  BasicButton,
  CustomSegmentedFilter,
  PageHeader,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import {
  execStatusDictionary,
  translateDictionaryI18nLabel
} from '../../../../../../../hooks/useStaticStatus/index.data';
import { Divider, Space } from 'antd';
import { ToggleButtonStyleWrapper } from '../../../../../Common/style';
import DownloadRecord from '../../../../../Common/DownloadRecord';
import { AuditResultFilterContainerStyleWrapper } from '../../../../../Common/AuditResultFilterContainer/style';
import { LeftArrowOutlined, SqlFileOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const SqlFileStatementOverview: React.FC = () => {
  const { t } = useTranslation();
  const { taskId, fileId } =
    useTypedParams<
      typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview
    >();

  const navigate = useTypedNavigate();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    noDuplicate,
    setNoDuplicate,
    execStatusFilterValue,
    setExecStatusFilterValue
  } = useAuditResultFilterParams();
  const { getAuditLevelStatusSelectOptionValues } = useStaticStatus();

  const { pagination, tableChange, updateTableFilterInfo, tableFilterInfo } =
    useTableRequestParams<IAuditTaskSQLResV2, GetAuditTaskSQLsPrams>();
  const { updateAllSelectedFilterItem, filterButtonMeta, filterContainerMeta } =
    useTableFilterContainer(
      [],
      updateTableFilterInfo,
      AuditTaskExtraFilterMeta()
    );

  const { data: currentFileOverview } = useRequest(() =>
    task
      .getAuditFileExecStatistic({
        task_id: taskId ?? '',
        file_id: fileId ?? ''
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      })
  );

  const { data, loading } = useRequest(
    () =>
      handleTableRequestError(
        task.getAuditTaskSQLsV2({
          task_id: taskId ?? '',
          filter_audit_file_id: Number(fileId),
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          filter_audit_level: tableFilterInfo.filter_audit_level,
          filter_exec_status: execStatusFilterValue,
          no_duplicate: noDuplicate
        })
      ),
    {
      refreshDeps: [
        pagination,
        execStatusFilterValue,
        noDuplicate,
        tableFilterInfo
      ]
    }
  );

  return (
    <SqlFileStatementOverviewStyleWrapper>
      <PageHeader
        title={
          <div className="page-title-wrapper">
            <SqlFileOutlined width={24} height={24} />
            {currentFileOverview?.file_name ?? ''}
          </div>
        }
        extra={
          <BasicButton
            icon={<LeftArrowOutlined />}
            onClick={() => {
              navigate(-1);
            }}
          >
            {t('audit.fileModeSqls.backToDetail')}
          </BasicButton>
        }
      />

      <SegmentedRowStyleWrapper justify="space-between">
        <AuditResultFilterContainerStyleWrapper className="audit-result-filter-container-borderless clear-padding">
          <CustomSegmentedFilter<
            getAuditTaskSQLsV2FilterExecStatusEnum | undefined
          >
            noStyle
            className="audit-result-filter-option"
            options={Object.keys(getAuditTaskSQLsV2FilterExecStatusEnum)}
            withAll={{
              label: t('audit.execStatus.allStatus'),
              value: undefined
            }}
            labelDictionary={translateDictionaryI18nLabel(execStatusDictionary)}
            onChange={setExecStatusFilterValue}
            value={execStatusFilterValue}
          />
        </AuditResultFilterContainerStyleWrapper>
        <Space size={12} className="audit-result-actions-wrap">
          <TableFilterButton
            updateAllSelectedFilterItem={updateAllSelectedFilterItem}
            filterButtonMeta={filterButtonMeta}
          />
          <Divider type="vertical" className="audit-result-actions-divider" />

          <ToggleButtonStyleWrapper
            active={noDuplicate}
            onClick={() => setNoDuplicate(!noDuplicate)}
          >
            {t('execWorkflow.create.auditResult.clearDuplicate')}
          </ToggleButtonStyleWrapper>
          <DownloadRecord taskId={taskId ?? ''} noDuplicate={noDuplicate} />
        </Space>
      </SegmentedRowStyleWrapper>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        filterCustomProps={
          new Map([
            ['audit_level', { options: getAuditLevelStatusSelectOptionValues }]
          ])
        }
      />

      <SqlStatementResultTable
        dataSource={data?.list ?? []}
        loading={loading}
        errorMessage={requestErrorMessage}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        onChange={tableChange}
        taskId={taskId}
        isPaginationFixed
      />
    </SqlFileStatementOverviewStyleWrapper>
  );
};

export default SqlFileStatementOverview;
