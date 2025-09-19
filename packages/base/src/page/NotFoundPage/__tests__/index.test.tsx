import { fireEvent, screen, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil';
import cloudBeaver from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver';
import NotFoundPage from '../index';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('NotFoundPage', () => {
  let getSqlQueryUrlSpy: jest.SpyInstance;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    getSqlQueryUrlSpy = cloudBeaver.getSqlQueryUrl();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render correctly with loading state', () => {
    const { baseElement } = superRender(<NotFoundPage />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal 404 page when not CloudBeaver page', async () => {
    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_query_root_uri: '/different/path'
        }
      })
    );

    const { baseElement } = superRender(<NotFoundPage />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlQueryUrlSpy).toHaveBeenCalled();
    expect(screen.getByText('抱歉，您访问的页面不存在')).toBeInTheDocument();
    expect(screen.getByText('返回首页')).toBeInTheDocument();
    expect(screen.getByText('建议')).toBeInTheDocument();
    expect(screen.getByText('检查URL是否正确输入')).toBeInTheDocument();
    expect(
      screen.getByText('使用导航菜单查找您需要的页面')
    ).toBeInTheDocument();
    expect(
      screen.getByText('如果问题持续存在，请联系我们的技术支持团队')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render CloudBeaver error page when is CloudBeaver page', async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        pathname: '/cloudbeaver/test'
      },
      writable: true
    });

    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_query_root_uri: '/cloudbeaver/test'
        }
      })
    );

    const { baseElement } = superRender(<NotFoundPage />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlQueryUrlSpy).toHaveBeenCalled();
    expect(screen.getByText('抱歉，SQL工作台暂时无法访问')).toBeInTheDocument();
    expect(screen.getByText('返回首页')).toBeInTheDocument();
    expect(screen.getByText('建议')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
  });

  it('should navigate to home page when back to home button clicked', async () => {
    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_query_root_uri: '/different/path'
        }
      })
    );

    superRender(<NotFoundPage />);

    await act(async () => jest.advanceTimersByTime(3000));

    const backToHomeButton = screen.getByText('返回首页');
    expect(backToHomeButton).toBeInTheDocument();

    fireEvent.click(backToHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
