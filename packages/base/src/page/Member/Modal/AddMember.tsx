import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { IMemberFormFields } from './index.type';
import MemberForm from './MemberForm';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IAddMemberParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import { BasicButton } from '@actiontech/shared';
import { MemberDrawerStyledWrapper } from '../style';

const AddMember: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = Form.useForm<IMemberFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) => state.member.modalStatus[ModalName.DMS_Add_Member]
  );

  const { projectID } = useCurrentProject();

  const submit = async () => {
    const values = await form.validateFields();
    const params: IAddMemberParams = {
      member: {
        is_project_admin: values.isProjectAdmin,
        user_uid: values.userUid,
        role_with_op_ranges: values.roles
      },
      project_uid: projectID
    };
    startSubmit();
    dms
      .AddMember(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('dmsMember.addMember.successTips', {
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
        modalName: ModalName.DMS_Add_Member,
        status: false
      })
    );
  };

  return (
    <MemberDrawerStyledWrapper
      open={visible}
      placement="right"
      size="large"
      title={t('dmsMember.addMember.modalTitle')}
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
      <MemberForm form={form} projectID={projectID} />
    </MemberDrawerStyledWrapper>
  );
};

export default AddMember;
