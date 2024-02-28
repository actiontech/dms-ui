/**
 * @test_version ce
 */
import { fireEvent, screen } from '@testing-library/react';
import { AdminUserDevopsSteps } from '../index.data';
import { superRender } from '../../../../../../testUtils/customRender';
import StepItems from '..';

describe('test base/Home/StepItems', () => {
  it('should match snapshot', () => {
    const projectID = '1';
    const navigateSpy = jest.fn();
    const setOpenRulePageProjectSelectorModalSpy = jest.fn();
    const steps_admin = AdminUserDevopsSteps({
      navigate: navigateSpy,
      projectID,
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    superRender(<StepItems steps={steps_admin} />);

    fireEvent.click(screen.getByText('发起导出工单'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/data/export`);
  });
});
