import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { workflowTemplateCardProps } from '../../../../testUtils/mockApi/workflowTemplate/data';
import StepCard from '.';
import { fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/WorkflowTemplate/StepCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const customRender = (data?: {
    [key: string]: string | boolean | undefined | ((index?: number) => void);
  }) => {
    return superRender(
      <StepCard {...workflowTemplateCardProps} {...(data ?? {})} />
    );
  };
  it('render step card with no operator and not active', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('-').length).toBe(1);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('render step card with disabled', async () => {
    const { baseElement } = customRender({
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
      active: true,
      indexNumber: undefined,
      click: clickMock,
      close: closeMock
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.step-card-style')).toBeInTheDocument();
    fireEvent.click(getBySelector('.step-card-style'));
    expect(clickMock).toBeCalledWith(0);
    expect(getBySelector('.ant-btn')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-btn'));
    expect(closeMock).toBeCalled();
  });
});
