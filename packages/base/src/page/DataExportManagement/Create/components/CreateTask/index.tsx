import BaseInfoForm from './BaseInfoForm';
import ExportMethodForm from './ExportMethodForm';
import ExportSourceForm from './ExportSourceForm';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import useCreateExportTaskForm from '../../hooks/useCreateExportTaskForm';
import ExportFormAction from './ExportFormAction';
import { Spin } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/dms-kit';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import BackToWorkflowList from '../../../Common/BackToWorkflowList';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { CreateDataExportPageEnum } from '../../../../../store/dataExport';
const CreateExportTask: React.FC = () => {
  const { t } = useTranslation();
  const { updatePageState } = useCreateDataExportReduxManage();
  const {
    baseForm,
    sourceForm,
    methodForm,
    auditAction,
    formatSQLAction,
    auditLoading,
    resetAllForms
  } = useCreateExportTaskForm();
  return (
    <Spin spinning={auditLoading}>
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed
          title={<BackToWorkflowList />}
          extra={
            <BasicButton onClick={resetAllForms} disabled={auditLoading}>
              {t('common.reset')}
            </BasicButton>
          }
        />
        <BaseInfoForm baseForm={baseForm} />
        <ExportSourceForm sourceForm={sourceForm} baseForm={baseForm} />
        <ExportMethodForm methodForm={methodForm} />

        <FormAreaBlockStyleWrapper
          style={{
            paddingBottom: 80
          }}
        >
          <ExportFormAction
            auditAction={() => {
              return auditAction().then((res) => {
                if (res) {
                  updatePageState(CreateDataExportPageEnum.SUBMIT_WORKFLOW);
                }
                return res;
              });
            }}
            auditLoading={auditLoading}
            formatSQLAction={formatSQLAction}
          />
        </FormAreaBlockStyleWrapper>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </Spin>
  );
};
export default CreateExportTask;
