import {
  fireEvent,
  screen,
  act,
  cleanup,
  renderHook
} from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import SQLStatementFormWrapper from '../index';
import { FormSubmitStatusContext } from '../..';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

describe('SQLAudit/SQLStatementFormWrapper', () => {
  let testGitConnectionSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    testGitConnectionSpy = configuration.testGitConnection();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const customRender = (submitLoading = false) => {
    const { result } = renderHook(() => Form.useForm());
    const form = result.current[0];
    return superRender(
      <FormSubmitStatusContext.Provider value={submitLoading}>
        <Form form={form}>
          <SQLStatementFormWrapper form={form} />
        </Form>
      </FormSubmitStatusContext.Provider>
    );
  };

  it('should render SQL upload type by default', async () => {
    const { baseElement } = customRender(false);

    expect(screen.getByText('输入SQL语句').closest('div')).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should switch to SQL file upload type', async () => {
    customRender(false);

    fireEvent.click(screen.getByText('上传SQL文件'));

    expect(
      screen.getByText('点击选择SQL文件或将文件拖拽到此区域')
    ).toBeInTheDocument();
  });

  it('should switch to XML file upload type', async () => {
    customRender(false);

    fireEvent.click(screen.getByText('上传Mybatis的XML文件'));

    expect(
      screen.getByText('点击选择Mybatis的XML文件或将文件拖拽到此区域')
    ).toBeInTheDocument();
  });

  it('should switch to SQL file upload type', async () => {
    customRender(false);

    fireEvent.click(screen.getByText('上传ZIP文件'));

    expect(
      screen.getByText(
        '点击选择ZIP文件或将文件拖拽到此区域，当前仅支持对ZIP文件中的.xml文件及.sql文件做SQL审核'
      )
    ).toBeInTheDocument();
  });

  it('should switch to git resp upload type', async () => {
    customRender(false);

    fireEvent.click(screen.getByText('配置GIT仓库'));

    expect(screen.getByText('GIT地址')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('密码')).toBeInTheDocument();
    expect(screen.getByText('代码分支')).toBeInTheDocument();
  });

  it('render git resp connection', async () => {
    customRender(false);

    fireEvent.click(screen.getByText('配置GIT仓库'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('代码分支')).toBeDisabled();
    expect(screen.getByText('请先验证仓库连通性')).toBeInTheDocument();

    fireEvent.input(screen.getByLabelText('GIT地址'), {
      target: { value: 'https://test.com' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.input(screen.getByLabelText('用户名'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('验证连接'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(testGitConnectionSpy).toHaveBeenCalledTimes(1);
    expect(testGitConnectionSpy).toHaveBeenCalledWith({
      git_http_url: 'https://test.com',
      git_user_name: 'test',
      git_user_password: '123456'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('连接成功')).toBeInTheDocument();

    expect(screen.getByLabelText('代码分支')).not.toBeDisabled();
    expect(screen.getByText('请选择代码分支')).toBeInTheDocument();
  });

  it('render git resp connection when reqeust return error', async () => {
    testGitConnectionSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_connected_success: false,
          error_message: '连接失败'
        }
      })
    );
    customRender(false);

    fireEvent.click(screen.getByText('配置GIT仓库'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('代码分支')).toBeDisabled();
    expect(screen.getByText('请先验证仓库连通性')).toBeInTheDocument();

    fireEvent.input(screen.getByLabelText('GIT地址'), {
      target: { value: 'https://test.com' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.input(screen.getByLabelText('用户名'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('验证连接'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(testGitConnectionSpy).toHaveBeenCalledTimes(1);
    expect(testGitConnectionSpy).toHaveBeenCalledWith({
      git_http_url: 'https://test.com',
      git_user_name: 'test',
      git_user_password: '123456'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('连接失败')).toBeInTheDocument();

    expect(screen.getByLabelText('代码分支')).toBeDisabled();
  });
});
