import { superRender } from '../../../../testUtils/customRender';
import StepCard from '.';
import { fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { workflowTemplateData } from '../../../../testUtils/mockApi/workflowTemplate/data';
import { IStepCardProps, StepInfoArrowEnum } from './index.type';
import { IconHonour } from '../../../../icon/WorkflowTemplate';

export const workflowTemplateCardProps = {
  rowKey: '1',
  key: '1',
  title: 'test',
  indexNumber: 1,
  show: true,
  disabled: false,
  icon: (
    <span className="honour-icon">
      <IconHonour />
    </span>
  ),
  arrow: StepInfoArrowEnum.none,
  desc: '',
  ...workflowTemplateData.workflow_step_template_list[0]
};

describe('page/WorkflowTemplate/StepCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const customRender = (data: IStepCardProps) => {
    return superRender(<StepCard {...data} />);
  };
  it('render step card with no operator and not active', async () => {
    const { baseElement } = customRender({ ...workflowTemplateCardProps });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('-').length).toBe(1);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('render step card with disabled', async () => {
    const { baseElement } = customRender({
      ...workflowTemplateCardProps,
      disabled: true,
      operator: 'admin',
      operatorTitle: 'testCard'
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.disable-step-card')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('testCard')).toBeInTheDocument();
  });

  it('render step card with operator and active', async () => {
    const clickMock = jest.fn();
    const closeMock = jest.fn();
    const { baseElement } = customRender({
      ...workflowTemplateCardProps,
      active: true,
      indexNumber: undefined,
      click: clickMock,
      close: closeMock
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.step-card-style')).toBeInTheDocument();
    fireEvent.click(getBySelector('.step-card-style'));
    expect(clickMock).toHaveBeenCalledWith(0);
    expect(getBySelector('.ant-btn')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-btn'));
    expect(closeMock).toHaveBeenCalled();
  });
});
