import { fireEvent, screen } from '@testing-library/react';
import ProjectTagList from '..';
import { superRender } from '@actiontech/shared/lib/testUtil';

describe('ProjectTagList', () => {
  it('should render "-" when no projects provided', () => {
    superRender(<ProjectTagList />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render "-" when empty projects array provided', () => {
    superRender(<ProjectTagList projectList={[]} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render project tags without more button when projects <= maxDisplayCount', () => {
    const projects = ['项目1', '项目2', '项目3'];

    superRender(<ProjectTagList projectList={projects} />);

    expect(screen.getByText('项目1')).toBeInTheDocument();
    expect(screen.getByText('项目2')).toBeInTheDocument();
    expect(screen.getByText('项目3')).toBeInTheDocument();
    expect(screen.queryByText('+0')).not.toBeInTheDocument();
  });

  it('should render projects with more button when projects > maxDisplayCount', () => {
    const projects = ['项目1', '项目2', '项目3', '项目4', '项目5'];

    superRender(<ProjectTagList projectList={projects} />);

    expect(screen.getByText('项目1')).toBeInTheDocument();
    expect(screen.getByText('项目2')).toBeInTheDocument();
    expect(screen.getByText('项目3')).toBeInTheDocument();
    expect(screen.queryByText('项目4')).not.toBeInTheDocument();
    expect(screen.queryByText('项目5')).not.toBeInTheDocument();

    // "+2" represents the count of additional projects
    expect(screen.getByText('+2个项目')).toBeInTheDocument();
  });

  it('should expand and collapse projects when clicking more/collapse button', () => {
    const projects = ['项目1', '项目2', '项目3', '项目4', '项目5', '项目6'];

    superRender(<ProjectTagList projectList={projects} maxDisplayCount={4} />);

    // Initial state - showing first 3 projects and +2 button
    expect(screen.getByText('项目1')).toBeInTheDocument();
    expect(screen.getByText('项目2')).toBeInTheDocument();
    expect(screen.getByText('项目3')).toBeInTheDocument();
    expect(screen.queryByText('项目4')).toBeInTheDocument();
    expect(screen.queryByText('项目5')).not.toBeInTheDocument();
    expect(screen.queryByText('项目6')).not.toBeInTheDocument();
    expect(screen.getByText('+2个项目')).toBeInTheDocument();

    // Click on +2 button to expand
    fireEvent.click(screen.getByText('+2个项目'));

    // Expanded state - showing all projects and collapse button
    expect(screen.getByText('项目1')).toBeInTheDocument();
    expect(screen.getByText('项目2')).toBeInTheDocument();
    expect(screen.getByText('项目3')).toBeInTheDocument();
    expect(screen.getByText('项目4')).toBeInTheDocument();
    expect(screen.getByText('项目5')).toBeInTheDocument();
    expect(screen.getByText('收起')).toBeInTheDocument();

    // Click on collapse button
    fireEvent.click(screen.getByText('收起'));

    // Back to initial state
    expect(screen.getByText('项目1')).toBeInTheDocument();
    expect(screen.getByText('项目2')).toBeInTheDocument();
    expect(screen.getByText('项目3')).toBeInTheDocument();
    expect(screen.getByText('项目4')).toBeInTheDocument();
    expect(screen.queryByText('项目5')).not.toBeInTheDocument();
    expect(screen.queryByText('项目6')).not.toBeInTheDocument();
    expect(screen.getByText('+2个项目')).toBeInTheDocument();
  });
});
