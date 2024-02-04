/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import RuleManager from '..';
import { useSelector } from 'react-redux';
import { RuleManagerSegmentedKey } from '../index.type';
import { ModalName } from '../../../data/ModalName';

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
