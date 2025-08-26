import { useMemo, useEffect, useCallback, useState } from 'react';
import { useTypedNavigate } from '@actiontech/shared';
import { Card, Row, Col, Typography, message } from 'antd';
import {
  FlagFilled,
  DatabaseFilled,
  DatabaseSchemaFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  useTableFilterContainer,
  TableToolbar,
  TableFilterContainer,
  ActiontechTableWrapper,
  ColumnsSettingProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResourceDetailListColumns } from './columns';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { ResourceDetailWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { IGetResourceOverviewResourceListV1Params } from '@actiontech/shared/lib/api/base/service/ResourceOverview/index.d';
import {
  ResourceDetailTableActions,
  ResourceDetailToolbarActions
} from './actions';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import ResourceTopology from './ResourceTopology';
import useFilterParams from './hooks/useFilterParams';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { useCurrentUser, usePermission } from '@actiontech/shared/lib/features';

const ResourceManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  const { username } = useCurrentUser();

  const navigate = useTypedNavigate();

  const [selectedKey, setSelectedKey] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const { parse2TableToolbarActionPermissions } = usePermission();

  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    refreshBySearchKeyword,
    searchKeyword,
    setSearchKeyword
  } = useTableRequestParams<
    IResourceListData,
    IGetResourceOverviewResourceListV1Params
  >();

  const { getLogoUrlByDbType, filterCustomProps } = useFilterParams(
    tableFilterInfo.filter_by_project_uid
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: resourceList,
    loading: getResourceListLoading,
    refresh: refreshResourceList
  } = useRequest(
    () => {
      return handleTableRequestError(
        DmsApi.ResourceOverviewService.GetResourceOverviewResourceListV1({
          ...tableFilterInfo,
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          fuzzy_search_resource_name: searchKeyword
        })
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const {
    data: topology,
    loading: topologyLoading,
    refresh: refreshTopology
  } = useRequest(
    () => {
      return DmsApi.ResourceOverviewService.GetResourceOverviewTopologyV1({
        ...tableFilterInfo
      }).then((res) => {
        return (
          res.data.data?.map((item, index) => {
            return {
              key: item.business_tag?.uid ?? '',
              title: item.business_tag?.name,
              icon: (
                <DatabaseSchemaFilled
                  color={baseTheme.resourceOverview.icon.schemaFilled}
                />
              ),
              selectable: false,
              className: 'business-tag-item',
              children: item.project?.length
                ? item.project?.map((project) => {
                    return {
                      key: project.project_uid ?? '',
                      title: project.project_name,
                      icon: <FlagFilled />,
                      selectable: false,
                      children: project.db_service?.map((service) => {
                        return {
                          key: service.db_service_uid ?? '',
                          title: service.db_service_name,
                          icon: (
                            <DatabaseFilled
                              color={
                                baseTheme.resourceOverview.icon.databaseFilled
                              }
                            />
                          )
                        };
                      })
                    };
                  })
                : [
                    {
                      key: `no-project-${index}`,
                      className: 'no-project-tips',
                      title: (
                        <Typography.Text type="secondary">
                          {t('resourceOverview.unboundProject')}
                        </Typography.Text>
                      ),
                      selectable: false,
                      children: []
                    }
                  ]
            };
          }) ?? []
        );
      });
    },
    {
      refreshDeps: [tableFilterInfo]
    }
  );

  const columns = useMemo(
    () =>
      ResourceDetailListColumns(getLogoUrlByDbType, baseTheme.resourceOverview),
    [getLogoUrlByDbType, baseTheme.resourceOverview]
  );

  const actions = useMemo(() => {
    const gotoDataSourceDetail = (record?: IResourceListData) => {
      navigate(ROUTE_PATHS.BASE.DATA_SOURCE.index, {
        params: { projectID: record?.project?.project_uid ?? '' }
      });
    };
    return ResourceDetailTableActions(gotoDataSourceDetail);
  }, [navigate]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'resource_overview_resource_list',
      username: username
    }),
    [username]
  );

  const { run: onExport, loading: exporting } = useRequest(
    () => {
      const hideLoading = messageApi.loading(t('resourceOverview.exportTips'));
      return DmsApi.ResourceOverviewService.DownloadResourceOverviewList(
        {
          ...tableFilterInfo,
          fuzzy_search_resource_name: searchKeyword
        },
        { responseType: 'blob' }
      ).then(() => {
        hideLoading();
      });
    },
    {
      manual: true
    }
  );

  const toolbarActions = useMemo(() => {
    return parse2TableToolbarActionPermissions(
      ResourceDetailToolbarActions(onExport, exporting)
    );
  }, [parse2TableToolbarActionPermissions, exporting, onExport]);

  const refreshPage = useCallback(() => {
    refreshTopology();
    refreshResourceList();
  }, [refreshTopology, refreshResourceList]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Resource_Overview_Page,
      () => {
        refreshPage();
      }
    );

    return unsubscribe;
  }, [refreshPage]);

  return (
    <ResourceDetailWrapper>
      {messageContextHolder}
      <ActiontechTableWrapper
        loading={topologyLoading || getResourceListLoading}
        setting={tableSetting}
      >
        <Card hoverable className="resource-detail-table-toolbar-card">
          <TableToolbar
            filterButton={{
              filterButtonMeta,
              updateAllSelectedFilterItem
            }}
            searchInput={{
              onChange: setSearchKeyword,
              defaultValue: searchKeyword,
              onSearch: () => {
                refreshBySearchKeyword();
              }
            }}
            actions={toolbarActions}
          />
          <TableFilterContainer
            filterContainerMeta={filterContainerMeta}
            updateTableFilterInfo={updateTableFilterInfo}
            disabled={getResourceListLoading}
            filterCustomProps={filterCustomProps}
          />
        </Card>
        <Row gutter={16} className="resource-detail-wrapper">
          <Col span={6}>
            <ResourceTopology
              topology={topology ?? []}
              selectedKey={selectedKey}
              setSelectedKey={setSelectedKey}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
            />
          </Col>
          <Col span={18}>
            <Card
              className="resource-detail-table-card"
              title={t('resourceOverview.resourceDetail')}
              hoverable
            >
              <ActiontechTable
                className="cursor-pointer"
                dataSource={resourceList?.list}
                rowKey={(record: IResourceListData) => {
                  return `${record?.resource_uid}`;
                }}
                pagination={{
                  total: resourceList?.total ?? 0,
                  current: pagination.page_index
                }}
                isPaginationFixed={false}
                columns={columns}
                errorMessage={requestErrorMessage}
                onChange={tableChange}
                actions={actions}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      setSelectedKey(record?.resource_uid);
                      if (
                        record?.resource_uid &&
                        !expandedKeys.some((i) => i === record?.resource_uid)
                      ) {
                        setExpandedKeys([
                          ...expandedKeys,
                          record?.resource_uid
                        ]);
                      }
                    },
                    className:
                      selectedKey === record?.resource_uid
                        ? 'ant-table-row-selected'
                        : ''
                  };
                }}
              />
            </Card>
          </Col>
        </Row>
      </ActiontechTableWrapper>
    </ResourceDetailWrapper>
  );
};

export default ResourceManagementPage;
