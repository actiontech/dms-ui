import { PageHeader, EmptyBox, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import DefaultPrompts from '../Common/DefaultPrompts';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import pipeline from '@actiontech/shared/lib/api/sqle/service/pipeline';
import { IGetPipelinesV1Params } from '@actiontech/shared/lib/api/sqle/service/pipeline/index.d';
import { IPipelineDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { useRequest } from 'ahooks';
import {
  pipelineConfigurationListColumns,
  PipelineConfigurationTableFilterParamType
} from './column';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import PipelineDetailDrawer from '../Drawer/PipelineDetailDrawer';
import { useDispatch } from 'react-redux';
import {
  updateSelectPipelineId,
  updatePipelineModalStatus
} from '../../../store/pipeline';
import { ModalName } from '../../../data/ModalName';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { usePermission } from '@actiontech/shared/lib/features';
import {
  PipelineConfigurationListActions,
  PipelineConfigurationListPageHeaderActions
} from './actions';

const PipelineConfigurationList = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  const dispatch = useDispatch();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID, projectName } = useCurrentProject();

  const { parse2TableActionPermissions } = usePermission();

  const {
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IPipelineDetail,
    PipelineConfigurationTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: pipelineList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetPipelinesV1Params = {
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        project_name: projectName,
        fuzzy_search_name_desc: searchKeyword
      };

      return handleTableRequestError(pipeline.getPipelinesV1(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEdit = (id?: number) => {
    navigate(ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.update, {
      params: { projectID, id: id?.toString() ?? '' }
    });
  };

  const onDelete = (id?: number) => {
    const hide = messageApi.loading(t('pipelineConfiguration.table.deleting'));
    pipeline
      .deletePipelineV1({
        pipeline_id: `${id}`,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('pipelineConfiguration.table.deleteSuccess'));
          refresh();
        }
      })
      .finally(() => {
        hide();
      });
  };

  const onViewPipelineDetail = (id?: number) => {
    dispatch(updateSelectPipelineId({ id }));
    dispatch(
      updatePipelineModalStatus({
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: true
      })
    );
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Pipeline_Configuration_list,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  const pageHeaderActions =
    PipelineConfigurationListPageHeaderActions(projectID);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('pipelineConfiguration.pageTitle')}
        extra={pageHeaderActions['create-pipeline']}
      />
      <EmptyBox
        if={!!pipelineList?.total || loading}
        defaultNode={<DefaultPrompts />}
      >
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
          searchInput={{
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            }
          }}
          loading={loading}
        />
        <ActiontechTable
          className="table-row-cursor"
          dataSource={pipelineList?.list}
          rowKey={(record: IPipelineDetail) => {
            return `${record?.id}`;
          }}
          pagination={{
            total: pipelineList?.total ?? 0
          }}
          columns={pipelineConfigurationListColumns(onViewPipelineDetail)}
          loading={loading}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          actions={parse2TableActionPermissions(
            PipelineConfigurationListActions(onEdit, onDelete)
          )}
        />
      </EmptyBox>
      <PipelineDetailDrawer />
    </>
  );
};

export default PipelineConfigurationList;
