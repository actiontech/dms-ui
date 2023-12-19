import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateMemberModalStatus } from '../../../../store/member';
import EventEmitter from '../../../../utils/EventEmitter';
import { IMemberGroupFormFields } from '../index.type';
import MemberGroupForm from './MemberGroupForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAddMemberGroupParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { BasicButton } from '@actiontech/shared';
import { MemberDrawerStyledWrapper } from '../../style';

const AddMemberGroup: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { projectID } = useCurrentProject();
  const [form] = Form.useForm<IMemberGroupFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const visible = useSelector(
    (state: IReduxState) =>
      state.member.modalStatus[ModalName.DMS_Add_Member_Group]
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IAddMemberGroupParams = {
      member_group: {
        name: values.name,
        user_uids: values.userUids,
        role_with_op_ranges: values.roles,
        is_project_admin: values.isProjectAdmin
      },
      project_uid: projectID
    };
    startSubmit();
    dms
      .AddMemberGroup(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsMember.addMemberGroup.successTips', {
              name: params?.member_group?.name ?? ''
            })
          );
          onClose();
          EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onClose = () => {
    form.resetFields();
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.DMS_Add_Member_Group,
        status: false
      })
    );
  };

  return (
    <MemberDrawerStyledWrapper
      open={visible}
      size="large"
      placement="right"
      title={t('dmsMember.addMemberGroup.modalTitle')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <MemberGroupForm form={form} projectID={projectID} />
    </MemberDrawerStyledWrapper>
  );
};

export default AddMemberGroup;
