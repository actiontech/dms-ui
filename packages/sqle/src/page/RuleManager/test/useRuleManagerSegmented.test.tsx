import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import useRuleManagerSegmented from '../useRuleManagerSegmented';
import { ModalName } from '../../../data/ModalName';
import { RuleManagerSegmentedKey } from '../index.type';
import { act } from '@testing-library/react';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('slqe/RuleManager/useRuleManagerSegmented', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should dispatch action', async () => {
    const dispatchSpy = jest.fn();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false },
          activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
        }
      })
    );
    const { result } = renderHooksWithRedux(useRuleManagerSegmented, {});
    expect(result.current.activeKey).toEqual(
      RuleManagerSegmentedKey.GlobalRuleTemplate
    );
    await act(async () => {
      result.current.updateActiveSegmentedKey(
        RuleManagerSegmentedKey.CustomRule
      );
      await jest.advanceTimersByTime(300);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'globalRuleTemplate/updateRuleManagerActiveSegmentedKey',
      payload: RuleManagerSegmentedKey.CustomRule
    });
  });
});
