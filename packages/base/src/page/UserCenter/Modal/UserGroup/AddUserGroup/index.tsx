import { useBoolean } from 'ahooks';
import { Space, Form, message } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import EventEmitter from '../../../../../utils/EventEmitter';
import UserGroupForm from '../UserGroupForm';
import { UserGroupFormField } from '../UserGroupForm/index.type';
import useUserGroupFormOption from '../UserGroupForm/useUserGroupFormOption';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const AddUserGroup = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.userCenter.modalStatus[ModalName.DMS_Add_User_Group]
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const close = () => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_User_Group,
        status: false
      })
    );
  };

  const [form] = Form.useForm<UserGroupFormField>();

  const [requestLoading, { setTrue: startRequest, setFalse: requestFinish }] =
    useBoolean();

  const addUserGroup = async () => {
    const values = await form.validateFields();
    try {
      startRequest();
      const res = await dms.AddUserGroup({
        user_group: {
          name: values.name,
          desc: values.desc,
          user_uids: values.userList
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        messageApi.open({
          type: 'success',
          content: t('dmsUserCenter.user.createUserGroup.successTips', {
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

  const { loading: getUserListLoading, usernameList } =
    useUserGroupFormOption(visible);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.user.createUserGroup.title')}
      open={visible}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={requestLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={addUserGroup}
            loading={requestLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <UserGroupForm
        form={form}
        userList={usernameList}
        getUserListLoading={getUserListLoading}
      />
    </BasicDrawer>
  );
};

export default AddUserGroup;
