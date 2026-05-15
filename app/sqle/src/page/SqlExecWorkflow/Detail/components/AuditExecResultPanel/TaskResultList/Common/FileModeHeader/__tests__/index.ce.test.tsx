/**
 * @test_version ce
 */

import { useParams } from 'react-router-dom';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import FileModeHeader from '..';
import { fireEvent, screen } from '@testing-library/dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('test FileModeHeader', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    (useParams as jest.Mock).mockReturnValue({ workflowId: '123' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the extra button when allowExec is true', () => {
    sqleSuperRender(
      <FileModeHeader taskId="1" refresh={jest.fn()} allowExec={true} />
    );

    expect(screen.queryByText('编辑上线顺序')).not.toBeInTheDocument();
  });
});
