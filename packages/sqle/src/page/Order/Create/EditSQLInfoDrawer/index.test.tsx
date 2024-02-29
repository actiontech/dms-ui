import { renderWithThemeAndRedux } from '../../../../testUtils/customRender';
import { cleanup, act, fireEvent } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

import EditSQLInfoDrawer from '.';
import { EditSQLInfoDrawerProps } from './index.type';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Order/Create/EditSQLInfoDrawer', () => {
  const onCloseFn = jest.fn();
  const submitFn = jest.fn();

  const customRender = (intoParams: Partial<EditSQLInfoDrawerProps> = {}) => {
    const params: EditSQLInfoDrawerProps = {
      open: false,
      auditLoading: false,
      changeSqlModeDisabled: false,
      currentSqlMode: WorkflowResV2ModeEnum.different_sqls,
      onClose: onCloseFn,
      username: 'user name',
      submit: submitFn,
      instanceNameChange: jest.fn(),
      projectName: 'projectName',
      projectID: 'projectID',
      schemaList: new Map([[0, ['schema1']]]),
      setSchemaList: jest.fn(),
      ruleTemplates: new Map([[0, { dbType: 'dbType1' }]]),
      setRuleTemplates: jest.fn(),
      setChangeSqlModeDisabled: jest.fn(),
      setCurrentSqlMode: jest.fn(),
      instanceInfo: new Map([
        [
          0,
          {
            instanceName: 'instance name',
            instanceSchemaName: 'instance schema name'
          }
        ]
      ]),
      setInstanceInfo: jest.fn()
    };
    return renderWithThemeAndRedux(
      <EditSQLInfoDrawer {...params} {...intoParams} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
    mockDatabaseType();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap when open false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open', () => {
    const { baseElement } = customRender({
      open: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open & click close', async () => {
    const { baseElement } = customRender({
      open: true
    });

    const closeIcon = getBySelector('div.closed-icon-custom', baseElement);
    fireEvent.click(closeIcon);
    await act(async () => jest.advanceTimersByTime(300));
    expect(onCloseFn).toBeCalled();
  });

  it('render snap when open & audit', async () => {
    const { baseElement } = customRender({
      open: true,
      auditLoading: true,
      changeSqlModeDisabled: true,
      currentSqlMode: WorkflowResV2ModeEnum.same_sqls
    });
    expect(baseElement).toMatchSnapshot();
  });
});
