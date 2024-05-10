import { useNavigate, useParams } from 'react-router-dom';
import SQLStatementResultTable from '../TaskResultList/Common/SQLStatementResultTable';
import { useRequest } from 'ahooks';
import {
  TableFilterButton,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useTranslation } from 'react-i18next';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconFile, IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import {
  AuditResultFilterContainerStyleWrapper,
  AuditResultFilterOptionsStyleWrapper,
  ToggleButtonStyleWrapper
} from '../../Common/style';
import { Divider, Space } from 'antd';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { AuditResultFilterOptionsType } from '../../Common/AuditResultFilterContainer/index.type';
import { execStatusDictionary } from '../../../../hooks/useStaticStatus/index.data';
import { useState } from 'react';
import { AuditTaskExtraFilterMeta } from '../index.data';
import DownloadRecord from '../../Common/DownloadRecord';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { SQLFileStatementOverviewStyleWrapper } from './style';
import {
  AuditResultExecStatusFilterType,
  GetAuditTaskPrams
} from '../index.type';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const SQLFileStatementOverview: React.FC = () => {
  const { t } = useTranslation();
  const { taskId, fileId } = useParams<{ taskId: string; fileId: string }>();

  const [duplicate, setDuplicate] = useState(false);

  const navigate = useNavigate();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [execStatusFilterValue, setExecStatusFilterValue] =
    useState<AuditResultExecStatusFilterType>('all');
  const { getAuditLevelStatusSelectOptionValues } = useStaticStatus();

  const { pagination, tableChange, updateTableFilterInfo, tableFilterInfo } =
    useTableRequestParams<IAuditTaskSQLResV2, GetAuditTaskPrams>();
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
          filter_exec_status:
            execStatusFilterValue === 'all' ? undefined : execStatusFilterValue,
          no_duplicate: duplicate
        })
      ),
    {
      refreshDeps: [
        pagination,
        execStatusFilterValue,
        duplicate,
        tableFilterInfo
      ]
    }
  );

  const filterOptions: AuditResultFilterOptionsType<AuditResultExecStatusFilterType>[] =
    [
      {
        value: 'all',
        label: t('audit.execStatus.allStatus')
      },
      ...Object.keys(getAuditTaskSQLsV2FilterExecStatusEnum).map<
        AuditResultFilterOptionsType<AuditResultExecStatusFilterType>
      >((v) => {
        const key = v as getAuditTaskSQLsV2FilterExecStatusEnum;

        return {
          value: key,
          label: t(execStatusDictionary[key])
        };
      })
    ];

  return (
    <SQLFileStatementOverviewStyleWrapper>
      <PageHeader
        title={
          <div className="page-title-wrapper">
            <IconFile width={24} height={24} />
            {currentFileOverview?.file_name ?? ''}
          </div>
        }
        extra={
          <BasicButton
            icon={<IconLeftArrow />}
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
          <Space className="audit-result-filter-options">
            {filterOptions.map((v) => (
              <AuditResultFilterOptionsStyleWrapper
                onClick={() => setExecStatusFilterValue(v.value)}
                active={execStatusFilterValue === v.value}
                key={v.value}
              >
                <span className="text">{v.label}</span>
              </AuditResultFilterOptionsStyleWrapper>
            ))}
          </Space>
        </AuditResultFilterContainerStyleWrapper>
        <Space size={12} className="audit-result-actions-wrap">
          <TableFilterButton
            updateAllSelectedFilterItem={updateAllSelectedFilterItem}
            filterButtonMeta={filterButtonMeta}
          />
          <Divider type="vertical" className="audit-result-actions-divider" />

          <ToggleButtonStyleWrapper
            active={duplicate}
            onClick={() => setDuplicate(!duplicate)}
          >
            {t('order.createOrder.auditResult.duplicate')}
          </ToggleButtonStyleWrapper>
          <DownloadRecord taskId={taskId ?? ''} duplicate={duplicate} />
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

      <SQLStatementResultTable
        dataSource={data?.list ?? []}
        loading={loading}
        errorMessage={requestErrorMessage}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        onChange={tableChange}
        isPaginationFixed
      />
    </SQLFileStatementOverviewStyleWrapper>
  );
};

export default SQLFileStatementOverview;
