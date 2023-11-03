import { useTranslation } from 'react-i18next';
import { OrderDetailAuditResultStyleWrapper } from './style';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import {
  AuditResultAuditStatusFilterType,
  GetAuditTaskPrams,
  OrderDetailAuditResultProps
} from './index.type';
import {
  AuditTaskResV1AuditLevelEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import InstanceSegmentedLabel from '../Common/InstanceSegmentedLabel';
import { useState, useRef, useCallback, useMemo } from 'react';
import OrderDetailAuditResultList from './List';
import {
  TableFilterButton,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space, Divider } from 'antd5';
import DownloadRecord from '../Common/DownloadRecord';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditTaskExtraFilterMeta } from './index.data';
import { ToggleButtonStyleWrapper } from '../Common/style';
import { useRequest, useInfiniteScroll } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import useStaticStatus from '../../../hooks/useStaticStatus';

import AuditResultFilterContainer from '../Common/AuditResultFilterContainer';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { AuditResultExecStatusFilterType } from './index.type';
import { AuditResultFilterOptionsType } from '../Common/AuditResultFilterContainer/index.type';
import { execStatusDictionary } from '../../../hooks/useStaticStatus/index.data';
import ListLayoutSelector from '../Common/ListLayoutSelector';
import DataSourceResultList from './DataSourceResultList';
import DataSourceWaterfallList from './DataSourceResultList/WaterfallList';
import { ListLayoutEnum } from '../Common/ListLayoutSelector/index.types';
import { cloneDeep } from 'lodash';

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

/**
 * 工单审核详情 & sql审核详情
 * 区别：使用 mode 区分是否为工单
 */
const AuditDetail: React.FC<OrderDetailAuditResultProps> = ({
  taskInfos,
  orderInfo,
  projectName,
  orderStatus,
  ...props
}) => {
  const { t } = useTranslation();
  const { mode = 'order', taskId } = props;
  const isOrder = useMemo(() => mode === 'order', [mode]);
  const [duplicate, setDuplicate] = useState(false);
  const [auditResultActiveKey, setAuditResultActiveKey] = useState<string>(
    isOrder ? OVERVIEW_TAB_KEY : mode
  );

  const [auditLevelFilterValue, setAuditLevelFilterValue] = useState<
    AuditResultExecStatusFilterType | AuditResultAuditStatusFilterType
  >('all');

  const [currentListLayout, setCurrentListLayout] = useState<ListLayoutEnum>(
    ListLayoutEnum.pagination
  );

  const scrollPageNumber = useRef(0);

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

  const {
    data: currentAuditTaskList,
    loading,
    refresh
  } = useRequest(
    () => {
      const task_id = !isOrder && taskId ? taskId : auditResultActiveKey;
      const filterStatusData = {
        [isOrder ? 'filter_exec_status' : 'filter_audit_level']:
          auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
      };
      return task
        .getAuditTaskSQLsV2({
          task_id,
          ...tableFilterInfo,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: duplicate,
          ...filterStatusData
        })
        .then((res) => {
          return {
            list: res.data.data,
            total: res.data.total_nums
          };
        });
    },
    {
      ready: isOrder
        ? !!auditResultActiveKey &&
          auditResultActiveKey !== OVERVIEW_TAB_KEY &&
          currentListLayout === ListLayoutEnum.pagination
        : !!(taskId && currentListLayout === ListLayoutEnum.pagination),
      refreshDeps: [
        tableFilterInfo,
        pagination,
        duplicate,
        auditResultActiveKey,
        auditLevelFilterValue,
        currentListLayout,
        orderStatus,
        taskId,
        mode
      ]
    }
  );

  const {
    data: currentAuditTaskInfiniteList,
    noMore,
    loading: scrollLoading,
    loadingMore,
    loadMore,
    mutate
  } = useInfiniteScroll<{
    list: IAuditTaskSQLResV2[];
    total: number;
  }>(
    (d) => {
      if (
        auditResultActiveKey === OVERVIEW_TAB_KEY ||
        currentListLayout !== ListLayoutEnum.scroll
      ) {
        return Promise.resolve({
          list: [],
          total: 0
        });
      }
      const page = d ? Math.ceil(d.list.length / 20) + 1 : 1;
      scrollPageNumber.current = page;
      const filterStatusData = {
        [isOrder ? 'filter_exec_status' : 'filter_audit_level']:
          auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
      };
      return task
        .getAuditTaskSQLsV2({
          task_id: isOrder ? auditResultActiveKey : taskId ?? '',
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: duplicate,
          ...filterStatusData
        })
        .then((res) => {
          return {
            list: res.data.data || [],
            total: res.data.total_nums || 0
          };
        });
    },
    {
      reloadDeps: [
        currentListLayout,
        auditResultActiveKey,
        duplicate,
        tableFilterInfo,
        auditLevelFilterValue,
        orderStatus
      ],
      isNoMore: (d) => {
        return d ? (d.list.length % 20 > 0 ? true : false) : false;
      }
    }
  );

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

  const onRefreshScrollList = useCallback(
    (number: number, page: number) => {
      if (auditResultActiveKey === OVERVIEW_TAB_KEY) {
        return;
      }
      const filterStatusData = {
        [isOrder ? 'filter_exec_status' : 'filter_audit_level']:
          auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
      };
      task
        .getAuditTaskSQLsV2({
          task_id: isOrder ? auditResultActiveKey : taskId ?? '',
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: duplicate,
          ...filterStatusData
        })
        .then((res) => {
          const { data } = res.data;
          const newList = cloneDeep(currentAuditTaskInfiniteList?.list) || [];
          newList.find((i, index) => {
            const newData = data?.find((x) => x.number === number);
            if (i.number === number && newData) {
              newList.splice(index, 1, newData);
              return true;
            }
            return false;
          });
          mutate({
            list: newList,
            total: currentAuditTaskInfiniteList?.total || 0
          });
        });
    },
    [
      auditResultActiveKey,
      duplicate,
      tableFilterInfo,
      currentAuditTaskInfiniteList,
      mutate,
      auditLevelFilterValue,
      isOrder,
      taskId
    ]
  );

  const currentTaskInfo = useMemo(() => {
    return isOrder
      ? (taskInfos ?? []).find((v) => `${v.task_id}` === auditResultActiveKey)
      : taskInfos?.[0];
  }, [auditResultActiveKey, taskInfos, isOrder]);

  return (
    <OrderDetailAuditResultStyleWrapper noMarginTop={!isOrder}>
      <div hidden={!isOrder} className="audit-result-title">
        {t('audit.result')}
      </div>
      <SegmentedRowStyleWrapper justify="space-between">
        {isOrder ? (
          <BasicSegmented
            value={auditResultActiveKey}
            hidden={mode !== 'order'}
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
              ...(taskInfos ?? []).map((v) => ({
                value: `${v.task_id}`,
                label: generateCurrentTaskLabel(v.instance_name, v.audit_level)
              }))
            ]}
          />
        ) : (
          //todo: 暂时的sql审核标题，之后放模糊搜索之后，就使用之前的标题
          <div className="audit-result-title no-padding">
            {t('audit.result')}
          </div>
        )}

        <Space
          hidden={auditResultActiveKey === OVERVIEW_TAB_KEY}
          className="audit-result-actions-wrap"
          size={12}
        >
          {isOrder ? (
            <>
              <TableFilterButton
                updateAllSelectedFilterItem={updateAllSelectedFilterItem}
                filterButtonMeta={filterButtonMeta}
              />
              <Divider
                type="vertical"
                className="audit-result-actions-divider"
              />
            </>
          ) : null}
          <ToggleButtonStyleWrapper
            active={duplicate}
            onClick={() => setDuplicate(!duplicate)}
          >
            {t('order.createOrder.auditResult.duplicate')}
          </ToggleButtonStyleWrapper>
          <DownloadRecord taskId={auditResultActiveKey} duplicate />
          <ListLayoutSelector
            value={currentListLayout}
            onChange={onLayoutChange}
          />
        </Space>
      </SegmentedRowStyleWrapper>

      {isOrder ? (
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          filterCustomProps={
            new Map([
              [
                'audit_level',
                { options: getAuditLevelStatusSelectOptionValues }
              ]
            ])
          }
        />
      ) : null}

      <EmptyBox if={auditResultActiveKey === OVERVIEW_TAB_KEY && isOrder}>
        <OrderDetailAuditResultList
          workflowID={orderInfo?.workflow_id ?? ''}
          projectName={projectName}
          setAuditResultActiveKey={setAuditResultActiveKey}
          {...props}
        />
      </EmptyBox>

      <EmptyBox if={auditResultActiveKey !== OVERVIEW_TAB_KEY}>
        {/* todo: 数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
        {isOrder ? (
          <AuditResultFilterContainer<AuditResultExecStatusFilterType>
            filterOptions={[
              {
                value: 'all',
                label: t('audit.execStatus.allStatus')
                // num: 299 * 4
              },
              ...filterOptions
            ]}
            filterValue={
              auditLevelFilterValue as AuditResultExecStatusFilterType
            }
            filterValueChange={setAuditLevelFilterValue}
            bordered={false}
            passRate={currentTaskInfo?.pass_rate}
            score={currentTaskInfo?.score}
            instanceSchemaName={currentTaskInfo?.instance_schema}
          />
        ) : (
          <AuditResultFilterContainer<AuditResultAuditStatusFilterType>
            filterOptions={[
              {
                value: 'all',
                label: t('audit.execStatus.allStatus')
                // num: 299 * 4
              },
              ...(getAuditLevelStatusSelectOptionValues as Array<
                AuditResultFilterOptionsType<WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum>
              >)
            ]}
            filterValue={
              auditLevelFilterValue as AuditResultAuditStatusFilterType
            }
            filterValueChange={setAuditLevelFilterValue}
            bordered={false}
            passRate={currentTaskInfo?.pass_rate}
            score={currentTaskInfo?.score}
          />
        )}
        {currentListLayout === ListLayoutEnum.scroll ? (
          <DataSourceWaterfallList
            list={currentAuditTaskInfiniteList?.list}
            loading={loadingMore || scrollLoading}
            hasMore={noMore}
            taskId={isOrder ? auditResultActiveKey : taskId ?? ''}
            next={loadMore}
            scrollPage={scrollPageNumber.current}
            refreshScrollList={onRefreshScrollList}
          ></DataSourceWaterfallList>
        ) : (
          <DataSourceResultList
            list={currentAuditTaskList?.list}
            total={currentAuditTaskList?.total}
            pagination={pagination}
            onChange={tableChange}
            loading={loading}
            taskId={isOrder ? auditResultActiveKey : taskId ?? ''}
            refresh={refresh}
          />
        )}
      </EmptyBox>
    </OrderDetailAuditResultStyleWrapper>
  );
};

export default AuditDetail;
