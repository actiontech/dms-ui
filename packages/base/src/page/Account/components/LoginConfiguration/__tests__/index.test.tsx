import { act, fireEvent, screen } from '@testing-library/react';
import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import {
  mockUseCurrentUser,
  baseMockApi,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil';
import LoginConfiguration from '../index';
import { DefaultLoginPageProps } from '../../../index.type';

const mockUpdateUserInfo = jest.fn();

const defaultProps: DefaultLoginPageProps = {
  userBaseInfo: {
    uid: '1',
    name: 'testuser',
    email: 'test@example.com',
    system: GetUserSystemEnum.WORKBENCH
  },
  updateUserInfo: mockUpdateUserInfo
};

describe('LoginConfiguration', () => {
  let updateCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentUser();
    updateCurrentUserSpy = baseMockApi.userCenter.updateCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render correctly with snapshot', () => {
    const { baseElement } = baseSuperRender(
      <LoginConfiguration {...defaultProps} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should display correct label text from i18n', () => {
    baseSuperRender(<LoginConfiguration {...defaultProps} />);
    expect(screen.getByText('登录设置')).toBeInTheDocument();
  });

  it('should display SQL工作台 when userBaseInfo.system is WORKBENCH', () => {
    baseSuperRender(<LoginConfiguration {...defaultProps} />);
    expect(screen.getByText('SQL工作台')).toBeInTheDocument();
  });

  it('should display 管理后台 when userBaseInfo.system is MANAGEMENT', () => {
    const props = {
      ...defaultProps,
      userBaseInfo: {
        ...defaultProps.userBaseInfo!,
        system: GetUserSystemEnum.MANAGEMENT
      }
    };
    baseSuperRender(<LoginConfiguration {...props} />);
    expect(screen.getByText('管理后台')).toBeInTheDocument();
  });

  it('should display - when userBaseInfo.system is undefined', () => {
    const props = {
      ...defaultProps,
      userBaseInfo: {
        ...defaultProps.userBaseInfo!,
        system: undefined
      }
    };
    baseSuperRender(<LoginConfiguration {...props} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should display - when userBaseInfo is undefined', () => {
    const props = {
      ...defaultProps,
      userBaseInfo: undefined
    };
    baseSuperRender(<LoginConfiguration {...props} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should pass correct props to LoginConfigurationModal', async () => {
    const { container } = baseSuperRender(
      <LoginConfiguration {...defaultProps} />
    );

    const configItemRow = container
      .querySelector('.config-item-label')
      ?.closest('.ant-row');
    fireEvent.mouseEnter(configItemRow!);

    const editButton = container.querySelector(
      '.config-item-filed-edit-button'
    );
    fireEvent.click(editButton!);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('为数据分析师和开发者提供，用于数据查询与操作。')
    ).toBeInTheDocument();
    const options = getAllBySelector('.ant-radio-wrapper');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('SQL工作台');
    expect(options[1]).toHaveTextContent('管理后台');
    fireEvent.click(options[1]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockUpdateUserInfo).toHaveBeenCalledTimes(1);
  });

  it('should handle mouse enter and leave events on ConfigItem', () => {
    const { container } = baseSuperRender(
      <LoginConfiguration {...defaultProps} />
    );

    const configItemRow = container
      .querySelector('.config-item-label')
      ?.closest('.ant-row');
    expect(configItemRow).toBeInTheDocument();

    let editButton = container.querySelector('.config-item-filed-edit-button');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('hidden');

    fireEvent.mouseEnter(configItemRow!);
    editButton = container.querySelector('.config-item-filed-edit-button');
    expect(editButton).not.toHaveAttribute('hidden');

    fireEvent.mouseLeave(configItemRow!);
    editButton = container.querySelector('.config-item-filed-edit-button');
    expect(editButton).toHaveAttribute('hidden');
  });
});
