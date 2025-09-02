import { useLocation, useNavigate } from 'react-router-dom';
import MenuList from '.';
import { renderWithThemeAndRouter } from '../../../../testUtils/customRender';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn()
}));

describe('diagnosis/MenuList', () => {
  const navigateSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = renderWithThemeAndRouter(<MenuList />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render menu list', async () => {
    renderWithThemeAndRouter(<MenuList />, undefined, {
      initialEntries: ['/']
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByText('监控源配置')).toBeInTheDocument();
    expect(getBySelector('.ant-menu-item-divider')).toBeInTheDocument();
  });

  it('click menu and render selected menu', async () => {
    renderWithThemeAndRouter(<MenuList />, undefined, {
      initialEntries: ['/']
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(getAllBySelector('.ant-menu-item')?.[0]);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/monitor-source-config');
  });
});
