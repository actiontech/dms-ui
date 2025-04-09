import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';
import { DmsApi } from '@actiontech/shared/lib/api';
import { IListProjectsV2Params } from '@actiontech/shared/lib/api/base/service/Project/index.d';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { usePermission, useUserInfo } from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ProjectListTableColumnFactory } from './columns';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  updateProjectModalStatus,
  updateSelectProject
} from '../../../store/project';
import { ModalName } from '../../../data/ModalName';
import { ProjectManagementTableActions } from './action';

const ProjectList: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { checkActionPermission } = usePermission();

  const dispatch = useDispatch();
  const { updateUserInfo } = useUserInfo();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListProjectV2,
    IListProjectsV2Params
  >();

  const {
    data: projectListData,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListProjectsV2Params = {
        ...pagination
      };
      return handleTableRequestError(
        DmsApi.ProjectService.ListProjectsV2(params)
      );
    },
    {
      refreshDeps: [pagination],
      onFinally: () => updateUserInfo()
    }
  );

  const deleteProject = useCallback(
    (record: IListProjectV2) => {
      const { uid = '', name = '' } = record;
      DmsApi.ProjectService.DelProject({ project_uid: uid }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsProject.projectList.deleteSuccessTips', {
              name
            })
          );
          refresh();
        }
      });
    },
    [refresh, t, messageApi]
  );

  const archiveProject = useCallback(
    (record: IListProjectV2) => {
      const { uid = '', name = '' } = record;
      DmsApi.ProjectService.ArchiveProject({ project_uid: uid }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsProject.projectList.archiveProjectSuccessTips', {
              name
            })
          );
          refresh();
          EventEmitter.emit(EmitterKey.DMS_Sync_Project_Archived_Status);
        }
      });
    },
    [refresh, t, messageApi]
  );

  const unarchiveProject = useCallback(
    (record: IListProjectV2) => {
      const { uid = '', name = '' } = record;
      DmsApi.ProjectService.UnarchiveProject({ project_uid: uid }).then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('dmsProject.projectList.unarchiveProjectSuccessTips', {
                name
              })
            );
            refresh();
            EventEmitter.emit(EmitterKey.DMS_Sync_Project_Archived_Status);
          }
        }
      );
    },
    [refresh, t, messageApi]
  );

  const updateProject = useCallback(
    (record: IListProjectV2) => {
      dispatch(
        updateProjectModalStatus({
          modalName: ModalName.DMS_Update_Project,
          status: true
        })
      );
      dispatch(updateSelectProject({ selectProject: record }));
    },
    [dispatch]
  );

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.DMS_Refresh_Project_List, refresh);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.DMS_Refresh_Project_List, refresh);
    };
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        dataSource={projectListData?.list}
        pagination={{
          total: projectListData?.total ?? 0,
          current: pagination.page_index
        }}
        rowKey="uid"
        loading={loading}
        columns={ProjectListTableColumnFactory()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={ProjectManagementTableActions({
          deleteProject,
          updateProject,
          archiveProject,
          unarchiveProject,
          checkActionPermission
        })}
      />
    </>
  );
};

export default ProjectList;
