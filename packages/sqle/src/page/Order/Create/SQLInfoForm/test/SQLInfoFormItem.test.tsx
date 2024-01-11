import { Form } from 'antd';
import { useSelector } from 'react-redux';
import { screen, cleanup } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { renderWithThemeAndRedux } from '../../../../../testUtils/customRender';
import { driverMeta } from '../../../../../hooks/useDatabaseType/index.test.data';

import SQLInfoFormItem from '../SQLInfoFormItem';
import { SQLInfoFormFields, SQLInfoFormItemProps } from '../index.type';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Order/Create/SQLInfoFormItem', () => {
  const projectName = mockProjectInfo.projectName;
  const projectID = mockProjectInfo.projectID;
  const submitFn = jest.fn();
  const instanceNameChangeFn = jest.fn();
  const setSchemaListFn = jest.fn();
  const setRuleTemplatesFn = jest.fn();
  const setChangeSqlModeDisabledFn = jest.fn();
  const setInstanceInfoFn = jest.fn();
  const setCurrentSqlModeFn = jest.fn();

  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SQLInfoFormFields>()
    );
    const params: SQLInfoFormItemProps = {
      form: result.current[0],
      submit: submitFn,
      instanceNameChange: instanceNameChangeFn,
      projectName,
      projectID,
      schemaList: new Map([[0, ['schema1']]]),
      setSchemaList: setSchemaListFn,
      ruleTemplates: new Map([[0, { dbType: 'dbType1' }]]),
      setRuleTemplates: setRuleTemplatesFn,
      changeSqlModeDisabled: false,
      setChangeSqlModeDisabled: setChangeSqlModeDisabledFn,
      currentSqlMode: WorkflowResV2ModeEnum.same_sqls,
      setCurrentSqlMode: setCurrentSqlModeFn,
      instanceInfo: new Map([[0, { instanceName: 'instance name 1' }]]),
      setInstanceInfo: setInstanceInfoFn,
      auditLoading: false
    };
    return renderWithThemeAndRedux(
      <Form>
        <SQLInfoFormItem {...params} />
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
  })

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap page', () => {
    const { baseElement } = customRender();

    expect(screen.getByText('选择相同SQL')).toBeInTheDocument();
    expect(screen.getByText('选择SQL语句上传方式')).toBeInTheDocument();
    expect(screen.getByText('输入SQL语句')).toBeInTheDocument();
    expect(screen.getByText('上传SQL文件')).toBeInTheDocument();
    expect(screen.getByText('上传ZIP文件')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });
});
