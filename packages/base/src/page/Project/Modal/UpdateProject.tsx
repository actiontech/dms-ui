import { useBoolean } from 'ahooks';
import { Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectFormFields } from './ProjectForm';
import ProjectForm from './ProjectForm/ProjectForm';
import { updateProjectModalStatus } from '../../../store/project';
import { IUpdateProjectV2Params } from '@actiontech/shared/lib/api/base/service/Project/index.d';
import { DmsApi } from '@actiontech/shared/lib/api';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import {
  ProjectProjectPriorityEnum,
  UpdateProjectProjectPriorityEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';

const UpdateProject: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = useForm<ProjectFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { visible, selectProjectItem } = useSelector((state: IReduxState) => ({
    visible: state.project.modalStatus[ModalName.DMS_Update_Project],
    selectProjectItem: state.project.selectProject ?? undefined
  }));

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateProjectModalStatus({
        modalName: ModalName.DMS_Update_Project,
        status: false
      })
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateProjectV2Params = {
      project_uid: selectProjectItem?.uid ?? '',
      project: {
        desc: values.desc,
        is_fixed_business: values.isFixedBusiness,
        business_tag: {
          id: values.businessTag
        },
        project_priority:
          values.priority as unknown as UpdateProjectProjectPriorityEnum
      }
    };
    startSubmit();
    DmsApi.ProjectService.UpdateProjectV2(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsProject.updateProject.updateSuccessTips', {
              name: selectProjectItem?.name
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.DMS_Refresh_Project_List);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        desc: selectProjectItem?.desc ?? '',
        name: selectProjectItem?.name ?? '',
        isFixedBusiness: selectProjectItem?.is_fixed_business ?? false,
        businessTag: selectProjectItem?.business_tag?.id ?? 0,
        priority:
          selectProjectItem?.project_priority as unknown as ProjectProjectPriorityEnum
      });
    }
  }, [form, visible, selectProjectItem]);

  return (
    <>
      <BasicDrawer
        open={visible}
        title={t('dmsProject.updateProject.modalTitle')}
        onClose={closeModal}
        placement="right"
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        {contextHolder}
        <ProjectForm form={form} isUpdate={true} />
      </BasicDrawer>
    </>
  );
};

export default UpdateProject;
