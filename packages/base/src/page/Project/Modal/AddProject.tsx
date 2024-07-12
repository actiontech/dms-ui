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
import { IAddProjectParams } from '@actiontech/shared/lib/api/base/service/Project/index.d';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import BusinessDescription from './BusinessDescription';

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
    const params: IAddProjectParams = {
      project: {
        name: values.name,
        desc: values.desc,
        is_fixed_business: values.isFixedBusiness,
        business: values.business?.map((i) => i.name ?? '')
      }
    };
    startSubmit();
    Project.AddProject(params)
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
        <BusinessDescription />
      </BasicDrawer>
    </>
  );
};

export default AddProject;
