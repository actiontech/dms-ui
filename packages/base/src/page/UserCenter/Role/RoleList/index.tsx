import { SyncOutlined } from '@ant-design/icons';
import { useAntdTable, useToggle } from 'ahooks';
import { Button, Card, Space, Table, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { tableHeaderFactory } from './tableHeader';
import { useEffect } from 'react';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import {
  updateSelectRole,
  updateUserManageModalStatus
} from '../../../../store/userCenter';
import { ModalName } from '../../../../data/ModalName';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { TablePaginationProps } from '@actiontech/shared/lib/types/common.type';
import { IListRolesParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';

const RoleList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);
  const [messageApi, contextHoler] = message.useMessage();

  const getRoleList = ({ current, pageSize }: TablePaginationProps) => {
    const params: IListRolesParams = {
      page_index: current,
      page_size: pageSize
    };

    return dms.ListRoles(params).then((res) => {
      return {
        list: res.data?.data ?? [],
        total: res.data?.total_nums ?? 0
      };
    });
  };

  const { tableProps } = useAntdTable(getRoleList, {
    refreshDeps: [refreshFlag]
  });

  const createRole = () => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_Role,
        status: true
      })
    );
  };

  const updateRole = (role: IListRole) => {
    dispatch(updateSelectRole({ role }));
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_Role,
        status: true
      })
    );
  };
  const deleteRole = (roleName: string, roleUid: string) => {
    const hideLoading = messageApi.loading(
      t('dmsUserCenter.role.deleteRole.deleting', { name: roleName }),
      0
    );
    dms
      .DelRole({
        role_uid: roleUid
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsUserCenter.role.deleteRole.deleteSuccessTips', {
              name: roleName
            })
          );
          toggleRefreshFlag();
        }
      })
      .finally(() => {
        setTimeout(() => {
          hideLoading();
        }, 300);
      });
  };

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.DMS_Refresh_Role_List, toggleRefreshFlag);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.DMS_Refresh_Role_List,
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
            {t('dmsUserCenter.role.roleList.title')}
            <Button onClick={toggleRefreshFlag}>
              <SyncOutlined spin={tableProps.loading} />
            </Button>
          </Space>
        }
        extra={[
          <Button key="create-role" type="primary" onClick={createRole}>
            {t('dmsUserCenter.role.createRole.button')}
          </Button>
        ]}
      >
        <Table
          rowKey="uid"
          columns={tableHeaderFactory(updateRole, deleteRole)}
          {...tableProps}
        />
      </Card>
    </>
  );
};

export default RoleList;
