import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd5';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import EventEmitter from '../../../../../utils/EventEmitter';
import UserGroupForm from '../UserGroupForm';
import { UserGroupFormField } from '../UserGroupForm/index.type';
import useUserGroupFormOption from '../UserGroupForm/useUserGroupFormOption';
import { IListUserGroup } from '@actiontech/shared/lib/api/base/service/common';
import { ListUserGroupStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const UpdateUserGroup = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.userCenter.modalStatus[ModalName.DMS_Update_User_Group]
  );

  const currentUserGroup = useSelector<IReduxState, IListUserGroup | null>(
    (state) => state.userCenter.selectUserGroup
  );

  const [form] = Form.useForm<UserGroupFormField>();

  const [createLoading, { setTrue: startRequest, setFalse: requestFinish }] =
    useBoolean();

  const [messageApi, contextHolder] = message.useMessage();

  const close = () => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_User_Group,
        status: false
      })
    );
  };

  const updateUserGroup = async () => {
    const values = await form.validateFields();
    try {
      startRequest();
      const res = await dms.UpdateUserGroup({
        user_group_uid: currentUserGroup?.uid ?? '',
        user_group: {
          desc: values.desc,
          user_uids: values.userList,
          is_disabled: values.isDisabled
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        messageApi.open({
          type: 'success',
          content: t('dmsUserCenter.user.updateUserGroup.successTips', {
            name: values.name
          })
        });
        EventEmitter.emit(EmitterKey.DMS_Refresh_User_Group_List);
        // EventEmitter.emit(EmitterKey.DMS_Refresh_User_List);
      }
    } finally {
      requestFinish();
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: currentUserGroup?.name,
        desc: currentUserGroup?.desc,
        isDisabled: currentUserGroup?.stat === ListUserGroupStatEnum.被禁用,
        userList: (currentUserGroup?.users ?? []).map((user) => user?.uid ?? '')
      });
    }
  }, [visible, currentUserGroup, form]);

  const { usernameList } = useUserGroupFormOption(visible);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.user.updateUserGroup.title')}
      open={visible}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={updateUserGroup}
            loading={createLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <UserGroupForm form={form} userList={usernameList} isUpdate={true} />
    </BasicDrawer>
  );
};

export default UpdateUserGroup;
