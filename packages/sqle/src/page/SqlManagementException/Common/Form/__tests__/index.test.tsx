import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Form } from 'antd';
import SqlManagementExceptionForm from '../index';
import { SqlManagementExceptionFormFieldType } from '../../../index.type';
import instance from '../../../../../testUtils/mockApi/instance';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../hooks/useInstance', () => ({
  __esModule: true,
  default: () => ({
    updateInstanceList: jest.fn(),
    instanceIDOptions: [],
    loading: false
  })
}));

jest.mock('../../../../../hooks/useRuleTips', () => ({
  __esModule: true,
  default: () => ({
    updateRuleTips: jest.fn(),
    ruleTips: [],
    generateRuleTipsSelectOptions: [],
    generateFlatRuleOptionsByDbType: () => [],
    dbTypeOptions: [],
    ruleNameDescMap: new Map(),
    mapRuleNamesToSelectValues: jest.fn((values: string[]) => values),
    loading: false
  }),
  splitRuleTipSelectValue: (value: string) => value
}));

jest.mock('../../../hooks/useAuditTaskSelectOptions', () => ({
  __esModule: true,
  default: () => ({
    auditTaskTypeOptions: [],
    getAuditTaskIdOptions: () => [],
    auditTaskTypeLoading: false,
    auditTaskIdLoading: false
  })
}));

describe('sqle/SqlManagementException/SqlManagementExceptionForm', () => {
  let getInstanceTipListSpy: jest.SpyInstance;
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
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SqlManagementExceptionFormFieldType>()
    );
    return renderWithReduxAndTheme(
      <SqlManagementExceptionForm form={result.current[0]} />
    );
  };

  it('should match snapshot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('匹配方式')).toBeInTheDocument();
    expect(screen.getByText('添加条件')).toBeInTheDocument();
  });

  it('render unified match rows', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('匹配方式')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加条件'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getAllByText('数据源').length).toBeGreaterThan(0);
  });
});
