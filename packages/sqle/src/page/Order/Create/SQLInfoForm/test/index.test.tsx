import { cleanup } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';
import { useSelector } from 'react-redux';

import SQLInfoForm from '..';
import { SQLInfoFormItemProps } from '../index.type';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { driverMeta } from '../../../../../hooks/useDatabaseType/index.test.data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Order/Create/SQLInfoForm', () => {
  const projectName = mockProjectInfo.projectName;
  const projectID = mockProjectInfo.projectID;
  const customRender = () => {
    const { result } = renderHooksWithTheme(() => Form.useForm<any>());
    const params: Omit<SQLInfoFormItemProps, 'form'> = {
      submit: jest.fn(),
      instanceNameChange: jest.fn(),
      projectName,
      projectID,
      schemaList: new Map([[0, ['schema1']]]),
      setSchemaList: jest.fn(),
      ruleTemplates: new Map([[0, { dbType: 'dbType1' }]]),
      setRuleTemplates: jest.fn(),
      changeSqlModeDisabled: false,
      setChangeSqlModeDisabled: jest.fn(),
      currentSqlMode: WorkflowResV2ModeEnum.same_sqls,
      setCurrentSqlMode: jest.fn(),
      instanceInfo: new Map([[0, { instanceName: 'instance name 1' }]]),
      setInstanceInfo: jest.fn(),
      auditLoading: false
    };
    return superRender(
      <Form>
        <SQLInfoForm form={result.current[0]} {...params} />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta }
      });
    });
    // Warning: validateDOMNesting(...): <form> cannot appear as a descendant of <form>
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });
});
