import { cleanup, screen, act } from '@testing-library/react';
import { baseSuperRender } from '../../testUtils/superRender';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import DataMaskRuleOverview from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('page/DataMaskRuleOverview', () => {
  const customRender = () => {
    return baseSuperRender(<DataMaskRuleOverview />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    dms.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render overview list snap', async () => {
    const request = dms.getMaskRuleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
    expect(screen.getByText('脱敏规则')).toBeInTheDocument();
    expect(screen.getByText('脱敏类型')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty overview list', async () => {
    const request = dms.getMaskRuleList();
    request.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
