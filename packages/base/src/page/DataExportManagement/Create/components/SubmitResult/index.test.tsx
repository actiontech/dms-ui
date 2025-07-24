import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockCreateDataExportRedux,
  mockUseCreateDataExportReduxManage
} from '../../testUtils/mockUseCreateDataExportReduxManage';
import { baseSuperRender } from '../../../../../testUtils/superRender';
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

    const { container } = baseSuperRender(<ExportWorkflowSubmitResult />);
    expect(container).toMatchSnapshot();
  });
});
