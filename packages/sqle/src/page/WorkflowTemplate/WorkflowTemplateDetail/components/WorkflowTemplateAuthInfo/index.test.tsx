import { superRender } from '../../../../../testUtils/customRender';
import WorkflowTemplateAuthInfo from '.';
import { workflowTemplateData } from '../../../../../testUtils/mockApi/workflowTemplate/data';
import { screen } from '@testing-library/react';
import { WorkflowTemplateAuthInfoProps } from './index.type';

describe('page/WorkflowTemplate/WorkflowTemplateAuthInfo', () => {
  const authInfoProps = {
    time: workflowTemplateData.update_time,
    level: workflowTemplateData.allow_submit_when_less_audit_level
  };

  const customRender = (data: WorkflowTemplateAuthInfoProps) => {
    return superRender(<WorkflowTemplateAuthInfo {...data} />);
  };

  it('render auth info', () => {
    const { baseElement } = customRender(authInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
    expect(screen.getByText('2023-12-26 14:19:12')).toBeInTheDocument();
  });
});
