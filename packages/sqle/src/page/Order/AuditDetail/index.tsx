import { useTranslation } from 'react-i18next';
import { OrderDetailAuditResultStyleWrapper } from './style';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { GetAuditTaskPrams, OrderDetailAuditResultProps } from './index.type';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import InstanceSegmentedLabel from '../Common/InstanceSegmentedLabel';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import OrderDetailAuditResultList from './List';
import {
  TableFilterButton,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space, Divider } from 'antd';
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
      return task
        .getAuditTaskSQLsV2({
          task_id: auditResultActiveKey,
          ...tableFilterInfo,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: duplicate,
          filter_exec_status:
            auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
        })
        .then((res) => {
          return {
            list: res.data.data,
            total: res.data.total_nums
          };
        });
    },
    {
      ready:
        !!auditResultActiveKey &&
        auditResultActiveKey !== OVERVIEW_TAB_KEY &&
        currentListLayout === ListLayoutEnum.pagination,
      refreshDeps: [
        tableFilterInfo,
        pagination,
        auditResultActiveKey,
        currentListLayout,
        orderStatus
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
      return task
        .getAuditTaskSQLsV2({
          task_id: auditResultActiveKey,
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: duplicate,
          filter_exec_status:
            auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
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
        tableFilterInfo,
        duplicate,
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

      task
        .getAuditTaskSQLsV2({
          task_id: auditResultActiveKey,
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: duplicate,
          filter_exec_status:
            auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
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
      auditLevelFilterValue
    ]
  );

  const currentTaskInfo = useMemo(
    () => taskInfos.find((v) => `${v.task_id}` === auditResultActiveKey),
    [auditResultActiveKey, taskInfos]
  );

  // @feature: useTableRequestParams 整合自定义filter info
  useEffect(() => {
    setPagination({ page_index: 1, page_size: pagination.page_size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLevelFilterValue, duplicate]);

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

        <Space
          hidden={auditResultActiveKey === OVERVIEW_TAB_KEY}
          className="audit-result-actions-wrap"
          size={12}
        >
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
          <DownloadRecord taskId={auditResultActiveKey} duplicate={duplicate} />
          <ListLayoutSelector
            value={currentListLayout}
            onChange={onLayoutChange}
          />
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
      <EmptyBox if={auditResultActiveKey === OVERVIEW_TAB_KEY}>
        <OrderDetailAuditResultList
          workflowID={orderInfo?.workflow_id ?? ''}
          projectName={projectName}
          setAuditResultActiveKey={setAuditResultActiveKey}
          {...props}
        />
      </EmptyBox>
      <EmptyBox if={auditResultActiveKey !== OVERVIEW_TAB_KEY}>
        {/* todo: 数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
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
        {currentListLayout === ListLayoutEnum.scroll ? (
          <DataSourceWaterfallList
            list={currentAuditTaskInfiniteList?.list}
            loading={loadingMore || scrollLoading}
            hasMore={noMore}
            taskId={auditResultActiveKey}
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
            taskId={auditResultActiveKey}
            refresh={refresh}
          />
        )}
      </EmptyBox>
    </OrderDetailAuditResultStyleWrapper>
  );
};

export default AuditDetail;
