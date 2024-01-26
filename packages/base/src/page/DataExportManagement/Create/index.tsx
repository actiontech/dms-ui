import useCreateDataExportReduxManage from './hooks/index.redux';
import { CreateDataExportPageEnum } from '../../../store/dataExport';
import CreateExportTask from './components/CreateTask';
import SubmitExportWorkflow from './components/SubmitWorkflow';
import ExportWorkflowSubmitResult from './components/SubmitResult';
import { useEffect } from 'react';

const CreateDataExport: React.FC = () => {
  const { pageState, clearAllState } = useCreateDataExportReduxManage();

  const render = () => {
    if (pageState === CreateDataExportPageEnum.CREATE_TASK) {
      return <CreateExportTask />;
    }

    if (pageState === CreateDataExportPageEnum.SUBMIT_WORKFLOW) {
      return <SubmitExportWorkflow />;
    }

    if (pageState === CreateDataExportPageEnum.SUBMIT_RESULT) {
      return <ExportWorkflowSubmitResult />;
    }

    return null;
  };

  useEffect(() => {
    return clearAllState();
  }, [clearAllState]);

  return render();
};

export default CreateDataExport;
