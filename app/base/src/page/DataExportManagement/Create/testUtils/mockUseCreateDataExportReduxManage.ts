import { CreateDataExportPageEnum } from '../../../../store/dataExport';
import { ExportMethodEnum } from '../components/CreateTask/ExportMethodForm/index.enum';
import * as useCreateDataExportReduxManage from '../hooks/index.redux';

export const mockCreateDataExportRedux = {
  updateDataExportInfoOpen: false,
  formValues: {
    baseValues: { workflow_subject: 'test', desc: 'desc' },
    sourceValues: { dbService: '121' },
    methodValues: { sql: 'select 1;', exportMethod: ExportMethodEnum.sql }
  },
  pageState: CreateDataExportPageEnum.CREATE_TASK,
  auditLoading: false,
  submitLoading: false,
  taskIDs: ['11111'],
  workflowID: '123',
  updateFormValues: jest.fn(),
  updatePageState: jest.fn(),
  updateAuditLoading: jest.fn(),
  updateSubmitLoading: jest.fn(),
  initModalStatus: jest.fn(),
  updateModalStatus: jest.fn(),
  updateTaskIDs: jest.fn(),
  updateWorkflowID: jest.fn(),
  clearAllState: jest.fn()
};

export const mockUseCreateDataExportReduxManage = (
  data?: Partial<typeof mockCreateDataExportRedux>
) => {
  const spy = jest.spyOn(useCreateDataExportReduxManage, 'default');
  spy.mockImplementation(() => ({ ...mockCreateDataExportRedux, ...data }));
  return spy;
};
