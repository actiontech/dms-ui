import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  SQLRuleExceptionColumn,
  SQLRuleExceptionTableFilterParamType,
  WhitelistColumn,
  WhitelistTableFilterParamType
} from './columns';
import { ModalName } from '../../../data/ModalName';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateWhitelistModalStatus } from '../../../store/whitelist';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  BasicButton,
  BasicSegmented,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import WhitelistDrawer from '../Drawer';
import {
  IAuditWhitelistResV1,
  ISQLRuleExceptionResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  IGetAuditWhitelistV1Params,
  IGetSQLRuleExceptionV1Params
} from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { PlusOutlined } from '@actiontech/icons';
import { whitelistMatchTypeOptions } from '../index.data';
import useWhitelistRedux from '../hooks/useWhitelistRedux';
import useInstance from '../../../hooks/useInstance';
import useUsername from '../../../hooks/useUsername';

enum WhitelistManageView {
  sql = 'sql',
  rule = 'rule'
}

const WhitelistList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName, projectID } = useCurrentProject();
  const { instanceIDOptions, updateInstanceList } = useInstance();
  const { usernameOptions, updateUsernameList } = useUsername();
  const [activeView, setActiveView] = useState<WhitelistManageView>(
    WhitelistManageView.sql
  );

  const {
    dispatch,
    updateSelectWhitelistRecord,
    openCreateWhitelistModal,
    actionPermission
  } = useWhitelistRedux();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IAuditWhitelistResV1,
    WhitelistTableFilterParamType
  >();

  const {
    tableFilterInfo: ruleExceptionTableFilterInfo,
    updateTableFilterInfo: updateRuleExceptionTableFilterInfo,
    tableChange: ruleExceptionTableChange,
    pagination: ruleExceptionPagination,
    searchKeyword: ruleExceptionSearchKeyword,
    setSearchKeyword: setRuleExceptionSearchKeyword,
    refreshBySearchKeyword: refreshRuleExceptionBySearchKeyword
  } = useTableRequestParams<
    ISQLRuleExceptionResV1,
    SQLRuleExceptionTableFilterParamType
  >();

  const columns = useMemo(() => WhitelistColumn(), []);
  const ruleExceptionColumns = useMemo(() => SQLRuleExceptionColumn(), []);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: whitelistList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetAuditWhitelistV1Params = {
        ...tableFilterInfo,
        page_index: String(pagination.page_index),
        page_size: String(pagination.page_size),
        project_name: projectName,
        fuzzy_search_value: searchKeyword
      };

      return handleTableRequestError(
        audit_whitelist.getAuditWhitelistV1(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const {
    data: ruleExceptionList,
    loading: ruleExceptionLoading,
    refresh: refreshRuleException
  } = useRequest(
    () => {
      const params: IGetSQLRuleExceptionV1Params = {
        ...ruleExceptionTableFilterInfo,
        page_index: String(ruleExceptionPagination.page_index),
        page_size: String(ruleExceptionPagination.page_size),
        project_name: projectName,
        fuzzy_search_value: ruleExceptionSearchKeyword
      };

      return handleTableRequestError(
        audit_whitelist.getSQLRuleExceptionV1(params)
      );
    },
    {
      manual: true,
      refreshDeps: [ruleExceptionPagination, ruleExceptionTableFilterInfo]
    }
  );

  const openUpdateWhitelistModal = useCallback(
    (selectRow: IAuditWhitelistResV1) => {
      updateSelectWhitelistRecord(selectRow);
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true
        })
      );
    },
    [dispatch, updateSelectWhitelistRecord]
  );

  const removeWhitelist = useCallback(
    (whitelistId: number) => {
      const hide = messageApi.loading(t('whitelist.operate.deleting'));
      audit_whitelist
        .deleteAuditWhitelistByIdV1({
          audit_whitelist_id: `${whitelistId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('whitelist.operate.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refresh, t]
  );

  const removeRuleException = useCallback(
    (sqlRuleExceptionId: number) => {
      const hide = messageApi.loading(t('whitelist.ruleException.deleting'));
      audit_whitelist
        .deleteSQLRuleExceptionV1({
          sql_rule_exception_id: `${sqlRuleExceptionId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('whitelist.ruleException.deleteSuccess'));
            refreshRuleException();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refreshRuleException, t]
  );

  const viewRuleExceptionAudit = useCallback(
    (record?: ISQLRuleExceptionResV1) => {
      const contentKeywords = [
        record?.sql_fingerprint,
        record?.rule_name
      ].filter(Boolean);

      const searchParams = new URLSearchParams({
        filter_operate_type_name: 'sql_rule_exception',
        audit_content_keywords: contentKeywords.join('|')
      });

      navigate(
        `/sqle/project/${projectID}/operation-record?${searchParams.toString()}`
      );
    },
    [navigate, projectID]
  );

  const whitelistActionsInTable: {
    buttons: ActiontechTableActionMeta<IAuditWhitelistResV1>[];
  } = {
    buttons: [
      {
        key: 'edit-whitelist',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: openUpdateWhitelistModal.bind(null, record ?? {})
        })
      },
      {
        key: 'remove-whitelist',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('whitelist.operate.confirmDelete'),
          onConfirm: removeWhitelist.bind(null, record?.audit_whitelist_id ?? 0)
        })
      }
    ]
  };

  const ruleExceptionActionsInTable: {
    buttons: ActiontechTableActionMeta<ISQLRuleExceptionResV1>[];
  } = {
    buttons: [
      {
        key: 'view-rule-exception-audit',
        text: t('whitelist.ruleException.viewAudit'),
        buttonProps: (record) => ({
          onClick: viewRuleExceptionAudit.bind(null, record)
        })
      },
      {
        key: 'remove-rule-exception',
        text: t('whitelist.ruleException.cancelAction'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('whitelist.ruleException.confirmCancel'),
          onConfirm: removeRuleException.bind(
            null,
            record?.sql_rule_exception_id ?? 0
          )
        })
      }
    ]
  };

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IAuditWhitelistResV1, FilterCustomProps>([
      ['match_type', { options: whitelistMatchTypeOptions }]
    ]);
  }, []);

  const ruleExceptionFilterCustomProps = useMemo(() => {
    return new Map<keyof ISQLRuleExceptionResV1, FilterCustomProps>([
      ['instance_name', { options: instanceIDOptions }],
      [
        'created_by',
        {
          options: usernameOptions.map((item) => ({
            ...item,
            value: item.text
          }))
        }
      ],
      ['created_at', { showTime: true }]
    ]);
  }, [instanceIDOptions, usernameOptions]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const {
    filterButtonMeta: ruleExceptionFilterButtonMeta,
    filterContainerMeta: ruleExceptionFilterContainerMeta,
    updateAllSelectedFilterItem: updateAllSelectedRuleExceptionFilterItem
  } = useTableFilterContainer(
    ruleExceptionColumns,
    updateRuleExceptionTableFilterInfo
  );

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateUsernameList({ filter_project: projectName });
  }, [projectName, updateInstanceList, updateUsernameList]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Whitelist_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  const segmentedOptions = useMemo(
    () => [
      {
        label: t('whitelist.view.sql'),
        value: WhitelistManageView.sql
      },
      {
        label: t('whitelist.view.rule'),
        value: WhitelistManageView.rule
      }
    ],
    [t]
  );

  const isSqlWhitelistView = activeView === WhitelistManageView.sql;

  useEffect(() => {
    if (!isSqlWhitelistView) {
      refreshRuleException();
    }
  }, [
    isSqlWhitelistView,
    refreshRuleException,
    ruleExceptionPagination,
    ruleExceptionTableFilterInfo
  ]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('whitelist.pageTitle')}
        extra={[
          <EmptyBox if={actionPermission} key="add-whitelist">
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
              onClick={openCreateWhitelistModal}
            >
              {t('whitelist.operate.addWhitelist')}
            </BasicButton>
          </EmptyBox>
        ]}
      />
      <BasicSegmented
        options={segmentedOptions}
        value={activeView}
        onChange={(value) => {
          setActiveView(value as WhitelistManageView);
        }}
      />
      {isSqlWhitelistView ? (
        <>
          <TableToolbar<IAuditWhitelistResV1>
            refreshButton={{
              refresh,
              disabled: loading
            }}
            filterButton={{
              filterButtonMeta,
              updateAllSelectedFilterItem
            }}
            searchInput={{
              onChange: setSearchKeyword,
              onSearch: refreshBySearchKeyword
            }}
            loading={loading}
          />
          <TableFilterContainer
            filterContainerMeta={filterContainerMeta}
            updateTableFilterInfo={updateTableFilterInfo}
            disabled={loading}
            filterCustomProps={filterCustomProps}
          />
          <ActiontechTable
            dataSource={whitelistList?.list}
            rowKey={(record: IAuditWhitelistResV1) => {
              return `${record?.audit_whitelist_id}`;
            }}
            pagination={{
              total: whitelistList?.total ?? 0
            }}
            loading={loading}
            columns={columns}
            actions={actionPermission ? whitelistActionsInTable : undefined}
            errorMessage={requestErrorMessage}
            onChange={tableChange}
            scroll={{}}
          />
        </>
      ) : (
        <>
          <TableToolbar<ISQLRuleExceptionResV1>
            refreshButton={{
              refresh: refreshRuleException,
              disabled: ruleExceptionLoading
            }}
            filterButton={{
              filterButtonMeta: ruleExceptionFilterButtonMeta,
              updateAllSelectedFilterItem:
                updateAllSelectedRuleExceptionFilterItem
            }}
            searchInput={{
              onChange: setRuleExceptionSearchKeyword,
              onSearch: refreshRuleExceptionBySearchKeyword
            }}
            loading={ruleExceptionLoading}
          />
          <TableFilterContainer
            filterContainerMeta={ruleExceptionFilterContainerMeta}
            updateTableFilterInfo={updateRuleExceptionTableFilterInfo}
            disabled={ruleExceptionLoading}
            filterCustomProps={ruleExceptionFilterCustomProps}
          />
          <ActiontechTable
            dataSource={ruleExceptionList?.list}
            rowKey={(record: ISQLRuleExceptionResV1) => {
              return `${
                record?.sql_rule_exception_id ??
                `${record.project_id}-${record.instance_id}-${record.sql_fingerprint}-${record.rule_name}`
              }`;
            }}
            pagination={{
              total: ruleExceptionList?.total ?? 0
            }}
            loading={ruleExceptionLoading}
            columns={ruleExceptionColumns}
            actions={actionPermission ? ruleExceptionActionsInTable : undefined}
            errorMessage={requestErrorMessage}
            onChange={ruleExceptionTableChange}
            scroll={{ x: 1600 }}
          />
        </>
      )}
      <WhitelistDrawer />
    </>
  );
};

export default WhitelistList;
