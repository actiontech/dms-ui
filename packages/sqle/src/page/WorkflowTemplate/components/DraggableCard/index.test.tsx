import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { workflowTemplateCardProps } from '../../../../testUtils/mockApi/workflowTemplate/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { fireEvent, screen } from '@testing-library/react';
import DraggableCard from '.';

describe('page/WorkflowTemplate/DraggableCard', () => {
  const removeMock = jest.fn();
  const customRender = (data?: {
    [key: string]: string | boolean | string[] | (() => void);
  }) => {
    return superRender(
      <DraggableCard {...workflowTemplateCardProps} {...(data ?? {})} />
    );
  };

  it('render no card', async () => {
    const { baseElement } = customRender({ show: false });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.step-box')).toBeInTheDocument();
  });

  it('render draggable card with empty desc', async () => {
    const { baseElement } = customRender({
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
      approved_by_authorized: false,
      assignee_user_id_list: ['1739544663515205632'],
      desc: descText,
      active: true,
      removeReviewNode: removeMock
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(descText)).toBeInTheDocument();
    expect(getBySelector('.ant-btn')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-btn'));
    expect(removeMock).toBeCalled();
  });
});
