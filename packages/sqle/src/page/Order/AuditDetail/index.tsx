import { useTranslation } from 'react-i18next';
import { OrderDetailAuditResultStyleWrapper } from './style';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { GetAuditTaskPrams, OrderDetailAuditResultProps } from './index.type';
import {
  AuditTaskResV1AuditLevelEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import InstanceSegmentedLabel from '../Common/InstanceSegmentedLabel';
import { useState, useMemo, useEffect } from 'react';
import OrderOverviewList from './OverviewList';
import {
  TableFilterButton,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space, Divider } from 'antd';
import DownloadRecord from '../Common/DownloadRecord';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditTaskExtraFilterMeta, OVERVIEW_TAB_KEY } from './index.data';
import { ToggleButtonStyleWrapper } from '../Common/style';
import useStaticStatus from '../../../hooks/useStaticStatus';
import AuditResultFilterContainer from '../Common/AuditResultFilterContainer';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { AuditResultExecStatusFilterType } from './index.type';
import { AuditResultFilterOptionsType } from '../Common/AuditResultFilterContainer/index.type';
import { execStatusDictionary } from '../../../hooks/useStaticStatus/index.data';
import ListLayoutSelector from '../Common/ListLayoutSelector';
import { ListLayoutEnum } from '../Common/ListLayoutSelector/index.types';
import TaskResultList from './TaskResultList';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

const AuditDetail: React.FC<OrderDetailAuditResultProps> = ({
  taskInfos,
  orderInfo,
  projectName,
  orderStatus,
  ...props
}) => {
  const { t } = useTranslation();
  const [duplicate, setDuplicate] = useState(false);
  const [auditResultActiveKey, setAuditResultActiveKey] =
    useState<string>(OVERVIEW_TAB_KEY);

  const [auditLevelFilterValue, setAuditLevelFilterValue] =
    useState<AuditResultExecStatusFilterType>('all');

  const [currentListLayout, setCurrentListLayout] = useState<ListLayoutEnum>(
    ListLayoutEnum.pagination
  );

  const { getAuditLevelStatusSelectOptionValues } = useStaticStatus();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    setPagination
  } = useTableRequestParams<IAuditTaskSQLResV2, GetAuditTaskPrams>();

  const { updateAllSelectedFilterItem, filterContainerMeta, filterButtonMeta } =
    useTableFilterContainer(
      [],
      updateTableFilterInfo,
      AuditTaskExtraFilterMeta()
    );

  const generateCurrentTaskLabel = (
    instanceName?: string,
    auditLevel?: AuditTaskResV1AuditLevelEnum
  ) => {
    if (!instanceName) {
      return '-';
    }

    return (
      <InstanceSegmentedLabel
        instanceName={instanceName}
        auditLevel={auditLevel}
      />
    );
  };

  const filterOptions: AuditResultFilterOptionsType<AuditResultExecStatusFilterType>[] =
    Object.keys(getAuditTaskSQLsV2FilterExecStatusEnum).map<
      AuditResultFilterOptionsType<AuditResultExecStatusFilterType>
    >((v) => {
      const key = v as getAuditTaskSQLsV2FilterExecStatusEnum;
      return {
        value: key,
        label: t(execStatusDictionary[key])
        // num: 20
      };
    });

  const onLayoutChange = (value: ListLayoutEnum) => {
    setCurrentListLayout(value);
    if (value === ListLayoutEnum.pagination) {
      setPagination({ page_index: 1, page_size: 20 });
    }
  };

  const currentTaskInfo = useMemo(
    () => taskInfos.find((v) => `${v.task_id}` === auditResultActiveKey),
    [auditResultActiveKey, taskInfos]
  );

  // @feature: useTableRequestParams 整合自定义filter info
  useEffect(() => {
    setPagination({ page_index: 1, page_size: pagination.page_size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLevelFilterValue, duplicate]);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Reset_Tasks_Result_Active_Key,
      () => {
        setAuditResultActiveKey(OVERVIEW_TAB_KEY);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <OrderDetailAuditResultStyleWrapper>
      <div className="audit-result-title">{t('audit.result')}</div>
      <SegmentedRowStyleWrapper justify="space-between">
        <BasicSegmented
          value={auditResultActiveKey}
          onChange={(value) => {
            if (value === OVERVIEW_TAB_KEY) {
              updateAllSelectedFilterItem(false);
            }
            setAuditResultActiveKey(value as string);
          }}
          options={[
            {
              value: OVERVIEW_TAB_KEY,
              label: t('order.auditResultCollection.overview')
            },
            ...taskInfos.map((v) => ({
              value: `${v.task_id}`,
              label: generateCurrentTaskLabel(v.instance_name, v.audit_level)
            }))
          ]}
        />

        <div hidden={auditResultActiveKey === OVERVIEW_TAB_KEY}>
          <EmptyBox
            if={orderInfo?.exec_mode === WorkflowResV2ExecModeEnum.sqls}
          >
            <Space size={12} className="audit-result-actions-wrap">
              <TableFilterButton
                updateAllSelectedFilterItem={updateAllSelectedFilterItem}
                filterButtonMeta={filterButtonMeta}
              />
              <Divider
                type="vertical"
                className="audit-result-actions-divider"
              />
              <ToggleButtonStyleWrapper
                active={duplicate}
                onClick={() => setDuplicate(!duplicate)}
              >
                {t('order.createOrder.auditResult.duplicate')}
              </ToggleButtonStyleWrapper>
              <DownloadRecord
                taskId={auditResultActiveKey}
                duplicate={duplicate}
              />
            </Space>
          </EmptyBox>

          <ListLayoutSelector
            value={currentListLayout}
            onChange={onLayoutChange}
          />
        </div>
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
      <EmptyBox if={auditResultActiveKey === OVERVIEW_TAB_KEY}>
        <OrderOverviewList
          workflowID={orderInfo?.workflow_id ?? ''}
          projectName={projectName}
          setAuditResultActiveKey={setAuditResultActiveKey}
          {...props}
        />
      </EmptyBox>
      <EmptyBox if={auditResultActiveKey !== OVERVIEW_TAB_KEY}>
        {/* todo: 数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
        <EmptyBox if={orderInfo?.exec_mode === WorkflowResV2ExecModeEnum.sqls}>
          <AuditResultFilterContainer<AuditResultExecStatusFilterType>
            filterOptions={[
              {
                value: 'all',
                label: t('audit.execStatus.allStatus')
                // num: 299 * 4
              },
              ...filterOptions
            ]}
            filterValue={auditLevelFilterValue}
            filterValueChange={setAuditLevelFilterValue}
            bordered={false}
            passRate={currentTaskInfo?.pass_rate}
            score={currentTaskInfo?.score}
            instanceSchemaName={currentTaskInfo?.instance_schema}
          />
        </EmptyBox>

        <TaskResultList
          taskId={auditResultActiveKey}
          currentListLayout={currentListLayout}
          auditLevelFilterValue={auditLevelFilterValue}
          duplicate={duplicate}
          auditResultActiveKey={auditResultActiveKey}
          tableFilterInfo={tableFilterInfo}
          orderStatus={orderStatus}
          pagination={pagination}
          tableChange={tableChange}
          executeMode={orderInfo?.exec_mode ?? WorkflowResV2ExecModeEnum.sqls}
        />
      </EmptyBox>
    </OrderDetailAuditResultStyleWrapper>
  );
};

export default AuditDetail;
