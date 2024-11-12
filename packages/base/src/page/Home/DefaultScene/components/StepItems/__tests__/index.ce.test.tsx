/**
 * @test_version ce
 */
import { fireEvent, renderHook, screen } from '@testing-library/react';
import { AdminUserDevopsSteps } from '../index.data';
import { superRender } from '../../../../../../testUtils/customRender';
import StepItems from '..';
import { useNavigate } from 'react-router-dom';
import { useTypedNavigate } from '@actiontech/shared';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/Home/StepItems', () => {
  it('should match snapshot', () => {
    const navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);

    const projectID = '1';
    const setOpenRulePageProjectSelectorModalSpy = jest.fn();
    const { result } = renderHook(() => useTypedNavigate());

    const steps_admin = AdminUserDevopsSteps({
      navigate: result.current,
      projectID,
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    superRender(<StepItems steps={steps_admin} />);

    fireEvent.click(screen.getByText('发起导出工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${projectID}/data/export`
    );
  });
});
