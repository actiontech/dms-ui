import { BasicDrawer } from '@actiontech/shared';
import useCreateDataExportReduxManage from '../../../hooks/index.redux';
import useCreateExportTaskForm from '../../../hooks/useCreateExportTaskForm';
import { useRef } from 'react';
import { ModalName } from '../../../../../../data/ModalName';
import { Divider, Spin } from 'antd';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import BaseInfoFormItem from '../../CreateTask/BaseInfoForm/BaseInfoFormItem';
import BaseInfoTag from 'sqle/src/page/Order/Create/EditSQLInfoDrawer/BaseInfoTag';
import { useTranslation } from 'react-i18next';
import ExportSourceFormItem from '../../CreateTask/ExportSourceForm/ExportSourceFormItem';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import ExportMethodFormItem from '../../CreateTask/ExportMethodForm/ExportMethodFormItem';
import {
  UpdateBseInfoFormStyleWrapper,
  UpdateInfoActionStyleWrapper,
  UpdateMethodInfoFormStyleWrapper,
  UpdateSourceInfoFormStyleWrapper,
  UpdateTaskInfoFormTitleStyleWrapper
} from './style';
import ExportFormAction from '../../CreateTask/ExportFormAction';

const UpdateInfoDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { username } = useCurrentUser();

  const syncDataReady = useRef(false);

  const { formValues, updateModalStatus, updateDataExportInfoOpen } =
    useCreateDataExportReduxManage();
  const {
    baseForm,
    sourceForm,
    methodForm,
    auditAction,
    formatSQLAction,
    auditLoading
  } = useCreateExportTaskForm();

  const closeHandle = () => {
    if (auditLoading) {
      return;
    }

    updateModalStatus({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: false
    });
  };

  return (
    <BasicDrawer
      afterOpenChange={(open) => {
        if (open && !syncDataReady.current) {
          baseForm.setFieldsValue({ ...formValues?.baseValues });
          sourceForm.setFieldsValue({ ...formValues?.sourceValues });
          methodForm.setFieldsValue({ ...formValues?.methodValues });
          syncDataReady.current = true;
        }
      }}
      open={updateDataExportInfoOpen}
      size="large"
      title={false}
      closeIcon={false}
      onClose={closeHandle}
      bodyStyle={{
        padding: 0
      }}
      width={735}
      noBodyPadding
    >
      <Spin spinning={auditLoading}>
        <UpdateBseInfoFormStyleWrapper form={baseForm}>
          <UpdateTaskInfoFormTitleStyleWrapper>
            {t('dmsDataExport.create.update.baseTitle')}
          </UpdateTaskInfoFormTitleStyleWrapper>
          <BaseInfoFormItem
            slot={<BaseInfoTag projectName={projectName} username={username} />}
          />
        </UpdateBseInfoFormStyleWrapper>

        <Divider style={{ marginTop: 12 }} />

        <UpdateSourceInfoFormStyleWrapper
          labelAlign="left"
          form={sourceForm}
          colon={false}
          className="clearPaddingBottom"
          {...formItemLayout.spaceBetween}
        >
          <UpdateTaskInfoFormTitleStyleWrapper>
            {t('dmsDataExport.create.update.sourceTitle')}
          </UpdateTaskInfoFormTitleStyleWrapper>

          <ExportSourceFormItem sourceForm={sourceForm} baseForm={baseForm} />
        </UpdateSourceInfoFormStyleWrapper>

        <Divider style={{ marginTop: 0 }} />

        <UpdateMethodInfoFormStyleWrapper
          labelAlign="left"
          form={methodForm}
          colon={false}
          className="clearPaddingBottom"
        >
          <UpdateTaskInfoFormTitleStyleWrapper>
            {t('dmsDataExport.create.update.methodTitle')}
          </UpdateTaskInfoFormTitleStyleWrapper>
          <ExportMethodFormItem methodForm={methodForm} />
        </UpdateMethodInfoFormStyleWrapper>

        <UpdateInfoActionStyleWrapper>
          <ExportFormAction
            auditAction={() => {
              auditAction().then((res) => {
                if (res) {
                  closeHandle();
                }
              });
            }}
            auditLoading={auditLoading}
            formatSQLAction={formatSQLAction}
          />
        </UpdateInfoActionStyleWrapper>
      </Spin>
    </BasicDrawer>
  );
};

export default UpdateInfoDrawer;
