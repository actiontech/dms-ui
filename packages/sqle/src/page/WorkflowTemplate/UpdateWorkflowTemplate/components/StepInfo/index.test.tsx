import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import StepInfo from '.';
import {
  userTipListData,
  workflowTemplateData
} from '../../../../../testUtils/mockApi/workflowTemplate/data';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector,
  sleep
} from '@actiontech/shared/lib/testUtil/customQuery';
import { IUpdateWorkflowStepInfoProps } from '../../../components/StepCard/index.type';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const height = 160;
const width = 700;
const offsetHeight = 'offsetHeight';
const offsetWidth = 'offsetWidth';

const mockGetBoundingClientRect = (element: any, index: number) =>
  jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
    bottom: 0,
    height,
    left: 0,
    right: 0,
    top: index * height,
    width,
    x: 0,
    y: index * height
  }));

describe('page/WorkflowTemplate/StepInfo', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    offsetHeight
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    offsetWidth
  );

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, offsetHeight, {
      configurable: true,
      value: height
    });
    Object.defineProperty(HTMLElement.prototype, offsetWidth, {
      configurable: true,
      value: width
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      offsetHeight,
      originalOffsetHeight ?? offsetHeight
    );
    Object.defineProperty(
      HTMLElement.prototype,
      offsetWidth,
      originalOffsetWidth ?? offsetWidth
    );
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
    const sourceEle = getAllBySelector(
      'div[aria-roledescription="sortable"]'
    )?.[1];
    // const targetEle = getAllBySelector(
    //   'div[aria-roledescription="sortable"]'
    // )?.[0];

    Object.setPrototypeOf(window, Window.prototype);

    draggableElement.forEach((draggable, index) => {
      mockGetBoundingClientRect(draggable, index);
    });

    fireEvent.keyDown(sourceEle, {
      code: 'Space'
    });

    fireEvent.keyDown(window, {
      code: 'ArrowUp'
    });
    sleep(1);

    fireEvent.keyDown(sourceEle, {
      code: 'Space'
    });
    // fireEvent.pointerDown(sourceEle, { isPrimary: true, button: 0 });
    // fireEvent.pointerMove(sourceEle, { clientX: 0, clientY: -100 });
    // // fireEvent.dragStart(sourceEle);
    // // fireEvent.dragOver(targetEle);
    // sleep(1);
    // // fireEvent.drop(targetEle);
    // // fireEvent.dragEnd(sourceEle);
    // fireEvent.pointerUp(sourceEle);
    // expect(exchangeMock).toBeCalledWith(1, 0);
  });
});
