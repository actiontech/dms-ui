import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import SqlManagementExceptionForm from '../index';
import { SqlManagementExceptionFormFieldType } from '../../../index.type';
import instance from '../../../../../testUtils/mockApi/instance';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('sqle/SqlManagementException/SqlManagementExceptionForm', () => {
  let getInstanceTipListSpy: jest.SpyInstance;

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseDbServiceDriver();
    getInstanceTipListSpy = instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    const { result } = superRenderHook(() =>
      Form.useForm<SqlManagementExceptionFormFieldType>()
    );
    return superRender(<SqlManagementExceptionForm form={result.current[0]} />);
  };

  it('should match snapshot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('关键字')).toBeChecked();
    expect(screen.getByLabelText('SQL语句')).toBeInTheDocument();
  });

  it('render switch match type ', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('关键字')).toBeChecked();
    expect(screen.getByLabelText('SQL语句')).toBeInTheDocument();

    fireEvent.click(screen.getByText('SQL指纹'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('SQL指纹')).toBeChecked();
    expect(screen.getByLabelText('SQL语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('IP'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#ip')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('网段'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#cidr')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('主机名'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#host')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('数据源'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#instance')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
