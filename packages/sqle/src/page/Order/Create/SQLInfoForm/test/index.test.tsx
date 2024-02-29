import { cleanup } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';

import SQLInfoForm from '..';
import { SQLInfoFormItemProps } from '../index.type';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockDatabaseType } from '../../../../../testUtils/mockHooks/mockDatabaseType';

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
    return superRender(<SQLInfoForm form={result.current[0]} {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockDatabaseType();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });
});
