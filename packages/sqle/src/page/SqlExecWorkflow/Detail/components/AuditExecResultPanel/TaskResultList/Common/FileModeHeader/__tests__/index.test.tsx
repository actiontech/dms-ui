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

  it('should render the header with title and extra button when allowExec is true', () => {
    const { baseElement } = sqleSuperRender(
      <FileModeHeader taskId="1" refresh={jest.fn()} allowExec={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑上线顺序')).toBeInTheDocument();

    fireEvent.click(screen.getByText('编辑上线顺序'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should not render the extra button when allowExec is false', () => {
    sqleSuperRender(
      <FileModeHeader taskId="1" refresh={jest.fn()} allowExec={false} />
    );

    expect(screen.queryByText('编辑上线顺序')).not.toBeInTheDocument();
  });
});
