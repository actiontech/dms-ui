import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd5';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { IMemberFormFields } from './index.type';
import MemberForm from './MemberForm';
import formatMemberRole from '../Common/formatMemberRole';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { BasicButton } from '@actiontech/shared';
import { MemberDrawerStyledWrapper } from '../style';
import { IUpdateMemberParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const UpdateMember: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<IMemberFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const { projectID } = useCurrentProject();
  const { visible, selectMember } = useSelector((state: IReduxState) => ({
    visible: state.member.modalStatus[ModalName.DMS_Update_Member],
    selectMember: state.member.selectMember
  }));

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateMemberParams = {
      member_uid: selectMember?.uid ?? '',
      member: {
        is_project_admin: values.isProjectAdmin,
        role_with_op_ranges: values.roles
      },
      project_uid: projectID
    };
    startSubmit();
    dms
      .UpdateMember(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsMember.updateMember.successTips', {
              name: ''
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.DMS_Update_Member,
        status: false
      })
    );
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        isProjectAdmin: selectMember?.is_project_admin,
        roles: formatMemberRole(selectMember?.role_with_op_ranges ?? []),
        userUid: selectMember?.user?.uid ?? ''
      });
    }
  }, [form, selectMember, visible]);

  return (
    <MemberDrawerStyledWrapper
      open={visible}
      size="large"
      placement="right"
      title={t('dmsMember.updateMember.modalTitle')}
      onClose={closeModal}
      footer={
        <Space>
          <BasicButton onClick={closeModal} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <MemberForm form={form} isUpdate={true} projectID={projectID} />
    </MemberDrawerStyledWrapper>
  );
};

export default UpdateMember;
