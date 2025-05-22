import { sqleSuperRender } from '../../../../../testUtils/superRender';
import WorkflowTemplateAuthInfo from '.';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { screen } from '@testing-library/react';
import { WorkflowTemplateAuthInfoProps } from './index.type';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('page/WorkflowTemplate/WorkflowTemplateAuthInfo', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  const authInfoProps = {
    time: workflowTemplateData.update_time,
    level: workflowTemplateData.allow_submit_when_less_audit_level
  };

  const customRender = (data: WorkflowTemplateAuthInfoProps) => {
    return sqleSuperRender(<WorkflowTemplateAuthInfo {...data} />);
  };

  it('render auth info', () => {
    const { baseElement } = customRender(authInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
    expect(screen.getByText('2023-12-26 14:19:12')).toBeInTheDocument();
  });
});
