import { useBoolean } from 'ahooks';
import { message, Space, Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { IMemberGroupFormFields } from './index.type';
import MemberGroupForm from './MemberGroupForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import formatMemberRole from '../Common/formatMemberRole';
import { IUpdateMemberGroupParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { BasicButton } from '@actiontech/shared';
import { MemberDrawerStyledWrapper } from '../style';

const UpdateMemberGroup: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<IMemberGroupFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { visible, selectMemberGroup } = useSelector((state: IReduxState) => ({
    visible: state.member.modalStatus[ModalName.DMS_Update_Member_Group],
    selectMemberGroup: state.member.selectMemberGroup
  }));

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateMemberGroupParams = {
      member_group_uid: selectMemberGroup?.uid ?? '',
      member_group: {
        user_uids: values.userUids,
        role_with_op_ranges: values.roles,
        is_project_admin: values.isProjectAdmin
      },
      project_uid: projectID
    };
    startSubmit();
    dms
      .UpdateMemberGroup(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsMember.updateMemberGroup.successTips', {
              name: values?.name
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.DMS_Refresh_Member_Group_List);
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
        modalName: ModalName.DMS_Update_Member_Group,
        status: false
      })
    );
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: selectMemberGroup?.name,
        userUids: (selectMemberGroup?.users ?? []).map(
          (user) => user.uid
        ) as string[],
        isProjectAdmin: selectMemberGroup?.is_project_admin,
        roles: formatMemberRole(selectMemberGroup?.role_with_op_ranges ?? [])
      });
    }
  }, [form, visible, selectMemberGroup]);

  return (
    <MemberDrawerStyledWrapper
      open={visible}
      size="large"
      placement="right"
      title={t('dmsMember.updateMemberGroup.modalTitle')}
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
      <MemberGroupForm form={form} isUpdate={true} projectID={projectID} />
    </MemberDrawerStyledWrapper>
  );
};

export default UpdateMemberGroup;
