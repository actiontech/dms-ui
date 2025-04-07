import { useBoolean } from 'ahooks';
import { Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateProjectModalStatus } from '../../../store/project';
import EventEmitter from '../../../utils/EventEmitter';
import ProjectForm from './ProjectForm/ProjectForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ProjectFormFields } from './ProjectForm';
import { IAddProjectV2Params } from '@actiontech/shared/lib/api/base/service/Project/index.d';
import { DmsApi } from '@actiontech/shared/lib/api';
import { BasicButton, BasicDrawer } from '@actiontech/shared';

const AddProject: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = useForm<ProjectFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) => state.project.modalStatus[ModalName.DMS_Add_Project]
  );

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateProjectModalStatus({
        modalName: ModalName.DMS_Add_Project,
        status: false
      })
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const params: IAddProjectV2Params = {
      project: {
        name: values.name,
        desc: values.desc,
        is_fixed_business: values.isFixedBusiness,
        business_tag: {
          id: values.businessTag
        },
        project_priority: values.priority
      }
    };
    startSubmit();
    DmsApi.ProjectService.AddProjectV2(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsProject.createProject.createSuccessTips', {
              name: params.project?.name ?? ''
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

  return (
    <>
      <BasicDrawer
        open={visible}
        title={t('dmsProject.createProject.modalTitle')}
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
        <ProjectForm form={form} />
      </BasicDrawer>
    </>
  );
};

export default AddProject;
