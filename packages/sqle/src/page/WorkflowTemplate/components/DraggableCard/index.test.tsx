import { sqleSuperRender } from '../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { fireEvent, screen } from '@testing-library/react';
import DraggableCard, { DraggableCardProps } from '.';
import { StepInfoArrowEnum } from '../StepCard/index.type';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { HonourFilled } from '@actiontech/icons';

const workflowTemplateCardProps = {
  rowKey: '1',
  key: '1',
  title: 'test',
  indexNumber: 1,
  show: true,
  disabled: false,
  icon: (
    <span className="honour-icon">
      <HonourFilled />
    </span>
  ),
  arrow: StepInfoArrowEnum.none,
  desc: '',
  ...workflowTemplateData.workflow_step_template_list[0]
};

describe('page/WorkflowTemplate/DraggableCard', () => {
  const removeMock = jest.fn();
  const customRender = (data: DraggableCardProps) => {
    return sqleSuperRender(<DraggableCard {...data} />);
  };

  it('render no card', async () => {
    const { baseElement } = customRender({
      ...workflowTemplateCardProps,
      show: false
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.step-box')).toBeInTheDocument();
  });

  it('render draggable card with empty desc', async () => {
    const { baseElement } = customRender({
      ...workflowTemplateCardProps,
      operator: 'admin',
      operatorTitle: 'review'
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.honour-icon')).toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBe(1);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('review')).toBeInTheDocument();
  });

  it('render draggable card with desc and remove icon', async () => {
    const descText = 'test desc';
    const { baseElement } = customRender({
      ...workflowTemplateCardProps,
      desc: descText,
      active: true,
      removeReviewNode: removeMock
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(descText)).toBeInTheDocument();
    expect(getBySelector('.ant-btn')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-btn'));
    expect(removeMock).toHaveBeenCalled();
  });
});
