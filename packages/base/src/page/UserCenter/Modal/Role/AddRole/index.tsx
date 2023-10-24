import { useCallback } from 'react';
import { message, Space, Form } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import RoleForm from '../RoleForm';
import { IRoleFormFields } from '../RoleForm/index.type';
import { useBoolean } from 'ahooks';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const AddRole = () => {
  const [form] = Form.useForm<IRoleFormFields>();

  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [createLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Add_Role]
  );

  const close = useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_Role,
        status: false
      })
    );
  }, [dispatch, form]);

  const addRole = useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    dms
      .AddRole({
        role: {
          name: values.name,
          desc: values.desc ?? '',
          op_permission_uids: values?.opPermissions ?? []
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          messageApi.open({
            type: 'success',
            content: t('dmsUserCenter.role.createRole.createSuccessTips', {
              name: values.name
            })
          });
          EventEmitter.emit(EmitterKey.DMS_Refresh_Role_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [close, form, setFalse, setTrue, t, messageApi]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.role.createRole.modalTitle')}
      open={visible}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={addRole} loading={createLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <RoleForm form={form} visible={visible} />
    </BasicDrawer>
  );
};

export default AddRole;
