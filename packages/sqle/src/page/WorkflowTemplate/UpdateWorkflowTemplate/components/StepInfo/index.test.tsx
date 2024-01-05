import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import StepInfo from '.';
import {
  userTipListData,
  workflowTemplateData
} from '../../../../../testUtils/mockApi/workflowTemplate/data';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { IUpdateWorkflowStepInfoProps } from '../../../components/StepCard/index.type';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('page/WorkflowTemplate/StepInfo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const addReviewMock = jest.fn();
  const removeReviewMock = jest.fn();
  const exchangeMock = jest.fn();
  const clickReviewMock = jest.fn();

  const stepInfoProps = {
    currentStep: 2,
    authLevel:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
    reviewStepData: workflowTemplateData.workflow_step_template_list.slice(
      0,
      2
    ),
    execStepData: workflowTemplateData.workflow_step_template_list[2],
    addReviewNode: addReviewMock,
    removeReviewNode: removeReviewMock,
    exchangeReviewNode: exchangeMock,
    clickReviewNode: clickReviewMock,
    usernameList: userTipListData
  };

  const onDragMoveMock = jest.fn();

  const customRender = (data: IUpdateWorkflowStepInfoProps) => {
    return superRender(<StepInfo {...data} />);
  };

  it('render step info and change review node number', async () => {
    const { baseElement } = customRender(stepInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加审核节点')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector('.add-review-node-icon button'));
      fireEvent.click(getBySelector('.add-review-node-icon button'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(addReviewMock).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-card-body .ant-btn')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-card-body .ant-btn'));
    expect(removeReviewMock).toBeCalled();

    expect(getAllBySelector('.ant-card').length).toBe(5);
    fireEvent.click(getAllBySelector('.ant-card')?.[0]);
    expect(clickReviewMock).toBeCalledWith(0);
  });

  it('drag to change step card order', () => {
    const { baseElement } = customRender(stepInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(getAllBySelector('.ant-card').length).toBe(5);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    const draggableElement = getAllBySelector(
      'div[aria-roledescription="sortable"]'
    );
    const sourceEle = draggableElement?.[1];
    const targetEle = draggableElement?.[0];

    // Object.setPrototypeOf(window, Window.prototype);

    // draggableElement.forEach((draggable, index) => {
    //   mockGetBoundingClientRect(draggable, index);
    // });

    // fireEvent.keyDown(sourceEle, {
    //   code: 'Space'
    // });

    // fireEvent.keyDown(window, {
    //   code: 'ArrowUp'
    // });
    // sleep(1);

    // fireEvent.keyDown(sourceEle, {
    //   code: 'Space'
    // });
    // fireEvent.pointerDown(sourceEle, { isPrimary: true, button: 0 });
    // fireEvent.pointerMove(sourceEle, { clientX: 0, clientY: -100 });
    // // fireEvent.dragStart(sourceEle);
    // // fireEvent.dragOver(targetEle);
    // sleep(1);
    // // fireEvent.drop(targetEle);
    // // fireEvent.dragEnd(sourceEle);
    // fireEvent.pointerUp(sourceEle);
    // expect(exchangeMock).toBeCalledWith(1, 0);

    // // simulate dragging
    // fireEvent.dragStart(sourceEle, { clientX: 0, clientY: 0 });
    // fireEvent.dragOver(targetEle, { clientX: 100, clientY: 100 });
    // fireEvent.dragEnd(sourceEle);
    fireEvent.dragStart(sourceEle);
    fireEvent.dragEnter(sourceEle);
    fireEvent.dragOver(sourceEle);
    fireEvent.drop(sourceEle);
    fireEvent.dragEnd(sourceEle);
  });
});
