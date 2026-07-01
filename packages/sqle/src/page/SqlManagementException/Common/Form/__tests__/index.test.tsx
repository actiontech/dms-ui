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
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { DB_TYPE_RULE_NAME_SEPARATOR } from '../../../../../hooks/useRuleTips';

const mockGenerateFlatRuleOptionsByDbType = jest.fn(() => [] as Array<{
  label: string;
  value: string;
}>);

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
    generateFlatRuleOptionsByDbType: mockGenerateFlatRuleOptionsByDbType,
    dbTypeOptions: [{ label: 'MySQL', value: 'MySQL' }],
    ruleNameDescMap: new Map([
      ['rule_a', 'Rule A desc'],
      ['rule_b', 'Rule B desc']
    ]),
    mapRuleNamesToSelectValues: jest.fn((values: string[]) => values),
    loading: false
  }),
  DB_TYPE_RULE_NAME_SEPARATOR: '_DB_TYPE_RULE_NAME_SEPARATOR_',
  splitRuleTipSelectValue: (value: string) => {
    const separator = '_DB_TYPE_RULE_NAME_SEPARATOR_';
    const separatorIndex = value.indexOf(separator);
    if (separatorIndex === -1) {
      return value;
    }
    return value.slice(separatorIndex + separator.length);
  }
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
    mockGenerateFlatRuleOptionsByDbType.mockReset();
    mockGenerateFlatRuleOptionsByDbType.mockReturnValue([]);
    mockUseDbServiceDriver();
    getInstanceTipListSpy = instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    props?: Partial<React.ComponentProps<typeof SqlManagementExceptionForm>>
  ) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SqlManagementExceptionFormFieldType>()
    );
    return renderWithReduxAndTheme(
      <SqlManagementExceptionForm form={result.current[0]} {...props} />
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

  it('shows all rules with triggered grouping from sql manage context', async () => {
    mockGenerateFlatRuleOptionsByDbType.mockReturnValue([
      {
        label: 'Rule A desc',
        value: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}rule_a`
      },
      {
        label: 'Rule B desc',
        value: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}rule_b`
      }
    ]);

    customRender({
      triggeredRuleScopeDisplay: [
        {
          rule_name: 'rule_a',
          level: 'warn',
          db_type: 'MySQL',
          rule_desc: 'Triggered rule A'
        }
      ]
    });

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('指定规则'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#rule_scope_db_type'));
    fireEvent.click(screen.getByTitle('MySQL'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockGenerateFlatRuleOptionsByDbType).toHaveBeenCalledWith('MySQL');

    fireEvent.mouseDown(getBySelector('#rule_scope'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('已触发规则')).toBeInTheDocument();
    expect(screen.getByText('其他规则')).toBeInTheDocument();
    expect(screen.getByText('Triggered rule A')).toBeInTheDocument();
    expect(screen.getByText('Rule B desc')).toBeInTheDocument();
  });
});
