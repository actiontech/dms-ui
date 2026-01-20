/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import OperationRecord from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('slqe/OperationRecord CE', () => {
  test('should match snap shot', async () => {
    mockUseCurrentProject({
      projectName: undefined
    });
    const { baseElement } = superRender(<OperationRecord />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('导出')).not.toBeInTheDocument();
    expect(screen.getByText('全局操作记录')).toBeInTheDocument();
  });

  test('should match snap shot when project name is exited', async () => {
    mockUseCurrentProject({
      projectName: 'test'
    });
    superRender(<OperationRecord />);
    expect(screen.getByText('操作记录')).toBeInTheDocument();
  });
});
