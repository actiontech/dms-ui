import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, message } from 'antd';
import { useAntdTable, useToggle } from 'ahooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { userGroupTableHeaderFactory } from './tableHeader';
import { ModalName } from '../../../../data/ModalName';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  updateSelectUserGroup,
  updateUserManageModalStatus
} from '../../../../store/userCenter';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { TablePaginationProps } from '@actiontech/shared/lib/types/common.type';
import { IListUserGroupsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import { IListUserGroup } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const UserGroupList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);
  const [messageApi, contextHoler] = message.useMessage();

  const getUserGroupList = ({ current, pageSize }: TablePaginationProps) => {
    const params: IListUserGroupsParams = {
      page_index: current,
      page_size: pageSize
    };

    return dms.ListUserGroups(params).then((res) => {
      return {
        list: res.data?.data ?? [],
        total: res.data?.total_nums ?? 0
      };
    });
  };

  const { tableProps } = useAntdTable(getUserGroupList, {
    refreshDeps: [refreshFlag]
  });

  const addUserGroup = () => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_User_Group,
        status: true
      })
    );
  };

  const updateUserGroup = (data: IListUserGroup) => {
    dispatch(
      updateSelectUserGroup({
        userGroup: data
      })
    );
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_User_Group,
        status: true
      })
    );
  };

  const deleteUserGroup = async (
    userGroupName: string,
    userGroupUid: string
  ) => {
    const hideLoading = messageApi.loading(
      t('dmsUserCenter.user.deleteUserGroup.deleting', { name: userGroupName }),
      0
    );
    try {
      const res = await dms.DelUserGroup({
        user_group_uid: userGroupUid
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('dmsUserCenter.user.deleteUserGroup.deleteSuccess', {
            name: userGroupName
          })
        );
        toggleRefreshFlag();
        EventEmitter.emit(EmitterKey.DMS_Refresh_User_List);
      }
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_User_Group_List,
      toggleRefreshFlag
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.DMS_Refresh_User_Group_List,
        toggleRefreshFlag
      );
    };
  }, [toggleRefreshFlag]);

  return (
    <>
      {contextHoler}
      <Card
        title={
          <Space>
            {t('dmsUserCenter.user.userGroupList.title')}
            <Button onClick={toggleRefreshFlag}>
              <SyncOutlined spin={tableProps.loading} />
            </Button>
          </Space>
        }
        extra={[
          <Button key="create-user" type="primary" onClick={addUserGroup}>
            {t('dmsUserCenter.user.userGroupList.addUserGroupButton')}
          </Button>
        ]}
      >
        <Table
          rowKey="uid"
          columns={userGroupTableHeaderFactory(
            updateUserGroup,
            deleteUserGroup
          )}
          {...tableProps}
        />
      </Card>
    </>
  );
};

export default UserGroupList;
