import { renderHook } from '@testing-library/react';
import useGenerateOrderStepsProps from '../useGenerateOrderStepsProps';

const projectName = 'default';
const workflowId = 'workflowId';

describe('sqle/Order/Detail/useGenerateOrderStepsProps', () => {
  const refreshOrderFn = jest.fn();
  const refreshOverviewActionFn = jest.fn();

  const customRender = () => {
    return renderHook(() =>
      useGenerateOrderStepsProps({
        refreshOrder: refreshOrderFn,
        refreshOverviewAction: refreshOverviewActionFn,
        projectName,
        workflowId
      })
    );
  };

  it('', () => {});
});
