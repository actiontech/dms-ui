/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import RuleManager from '..';
import { useSelector } from 'react-redux';
import { RuleManagerSegmentedKey } from '../index.type';
import { ModalName } from '../../../data/ModalName';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { cleanup } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/RuleManager CE', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });
  afterEach(() => {
    cleanup();
  });
  it('should match snapshot', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false },
          activeSegmentedKey: RuleManagerSegmentedKey.CustomRule
        }
      })
    );
    const { container } = renderWithReduxAndTheme(<RuleManager />);
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('新 建')).not.toBeInTheDocument();
  });
});
