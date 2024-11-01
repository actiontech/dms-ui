import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import BasicInfoWrapper from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { BasicInfoWrapperProps } from '../index.type';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { cleanup } from '@testing-library/react';

describe('sqle/ExecWorkflow/BasicInfoWrapper', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    cleanup();
  });
  const customRender = (params: BasicInfoWrapperProps) => {
    return superRender(<BasicInfoWrapper {...params} />);
  };

  it('render snap when has need params', () => {
    const { baseElement } = customRender({
      title: 'basic title'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has all params', () => {
    const { baseElement } = customRender({
      title: 'basic title',
      desc: 'this is a desc str',
      status: WorkflowRecordResV2StatusEnum.exec_failed,
      className: 'custom-class-name-a',
      gap: 10,
      sqlVersion: {
        sql_version_id: 1,
        sql_version_name: 'v1-test'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
