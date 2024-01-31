import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockCreateDataExportRedux,
  mockUseCreateDataExportReduxManage
} from '../../testUtils/mockUseCreateDataExportReduxManage';
import { superRender } from '../../../../../testUtils/customRender';
import ExportWorkflowSubmitResult from '.';

describe('test base/DataExport/Create/SubmitResult', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();
    mockUseCreateDataExportReduxManage({
      formValues: {
        ...mockCreateDataExportRedux.formValues,
        baseValues: { workflow_subject: 'test', desc: 'desc-desc' }
      },
      workflowID: '123'
    });

    const { container } = superRender(<ExportWorkflowSubmitResult />);
    expect(container).toMatchSnapshot();
  });
});
