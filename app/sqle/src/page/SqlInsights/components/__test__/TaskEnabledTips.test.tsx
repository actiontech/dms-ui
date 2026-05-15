import { cleanup, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil';
import TaskEnabledTips from '../TaskEnabledTips';

describe('TaskEnabledTips', () => {
  beforeEach(() => {
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should render component correctly', () => {
    const onGoToEnableMock = jest.fn();
    const { baseElement } = superRender(
      <TaskEnabledTips onGoToEnable={onGoToEnableMock} />
    );

    expect(screen.getByText('当前管控类型未开启')).toBeInTheDocument();
    expect(screen.getByText('[去开启]')).toBeInTheDocument();
    expect(baseElement.querySelector('.task-enabled-tips')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should call onGoToEnable when clicking the enable link', () => {
    const onGoToEnableMock = jest.fn();
    superRender(<TaskEnabledTips onGoToEnable={onGoToEnableMock} />);

    const enableLink = screen.getByText('[去开启]');
    fireEvent.click(enableLink);

    expect(onGoToEnableMock).toHaveBeenCalledTimes(1);
  });

  it('should not render component when checkActionPermission is false', () => {
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(false)
      },
      {
        useSpyOnMockHooks: true
      }
    );

    const { baseElement } = superRender(
      <TaskEnabledTips onGoToEnable={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('当前管控类型未开启')).toBeInTheDocument();
    expect(screen.queryByText('[去开启]')).not.toBeInTheDocument();
  });
});
