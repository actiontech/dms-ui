import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { mockCodingConfigurationData } from '@actiontech/shared/lib/testUtil/mockApi/base/system/data';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import CodingSetting from '..';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/dms-kit';

describe('base/System/ProcessConnection/CodingSetting', () => {
  let getCodingConfigurationSpy: jest.SpyInstance;
  let updateCodingConfigurationSpy: jest.SpyInstance;
  let testCodingConfig: jest.SpyInstance;

  const customRender = () => {
    return superRender(<CodingSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    getCodingConfigurationSpy = system.getCodingConfiguration();
    updateCodingConfigurationSpy = system.updateCodingConfiguration();
    testCodingConfig = system.testCodingConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(getCodingConfigurationSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#enabled')).toBeChecked();
  });

  it('render snap when user is not admin or global manager', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.certainProjectManager]: true,
        [SystemRole.auditAdministrator]: true,
        [SystemRole.projectDirector]: true
      }
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(mockCodingConfigurationData.coding_url)
    ).toBeInTheDocument();
  });

  it('render close coding configuration', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('启用Coding对接')).toBeInTheDocument();

    fireEvent.click(getBySelector('#enabled'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateCodingConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateCodingConfigurationSpy).toHaveBeenCalledWith({
      is_coding_enabled: false,
      coding_url: mockCodingConfigurationData.coding_url
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCodingConfigurationSpy).toHaveBeenCalledTimes(2);
  });

  it('render edit coding configuration', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.modify-coding-configuration')).toBeVisible();
    fireEvent.click(getBySelector('.modify-coding-configuration'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#codingUrl')).toBeVisible();
    expect(getBySelector('#token')).toBeVisible();
    const mockFormData = {
      codingUrl: 'test url',
      token: '123456'
    };
    fireEvent.change(getBySelector('#codingUrl'), {
      target: {
        value: mockFormData.codingUrl
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#token'), {
      target: { value: mockFormData.token }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateCodingConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateCodingConfigurationSpy).toHaveBeenCalledWith({
      is_coding_enabled: true,
      coding_url: mockFormData.codingUrl,
      token: mockFormData.token
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCodingConfigurationSpy).toHaveBeenCalledTimes(2);
  });

  it('render test coding connection', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.system-config-button')).toBeVisible();
    fireEvent.click(getBySelector('.system-config-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#codingProjectName')).toBeInTheDocument();

    fireEvent.change(getBySelector('#codingProjectName'), {
      target: {
        value: 'test_project'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('正在测试Coding联通性...')).toBeInTheDocument();
    expect(testCodingConfig).toHaveBeenCalledTimes(1);
    expect(testCodingConfig).toHaveBeenCalledWith({
      coding_project_name: 'test_project'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('当前服务地址和访问令牌验证通过')
    ).toBeInTheDocument();
  });

  it('render test coding connection when request return error message', async () => {
    testCodingConfig.mockClear();
    testCodingConfig.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          error_message: '链接失败',
          is_message_sent_normally: false
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.system-config-button')).toBeVisible();
    fireEvent.click(getBySelector('.system-config-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#codingProjectName')).toBeInTheDocument();

    fireEvent.change(getBySelector('#codingProjectName'), {
      target: {
        value: 'test_project'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('正在测试Coding联通性...')).toBeInTheDocument();
    expect(testCodingConfig).toHaveBeenCalledTimes(1);
    expect(testCodingConfig).toHaveBeenCalledWith({
      coding_project_name: 'test_project'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('链接失败')).toBeInTheDocument();
  });

  it('render open coding configuration', async () => {
    getCodingConfigurationSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          coding_url: '',
          is_coding_enabled: false
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = getBySelector('#enabled');
    expect(switchEle).not.toBeChecked();

    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    const mockFormData = {
      codingUrl: 'test url',
      token: '123456'
    };
    fireEvent.change(getBySelector('#codingUrl'), {
      target: {
        value: mockFormData.codingUrl
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#token'), {
      target: { value: mockFormData.token }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(
        '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateCodingConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateCodingConfigurationSpy).toHaveBeenCalledWith({
      is_coding_enabled: true,
      coding_url: mockFormData.codingUrl,
      token: mockFormData.token
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCodingConfigurationSpy).toHaveBeenCalledTimes(2);
  });
});
