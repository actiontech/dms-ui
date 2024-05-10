import { Form } from 'antd';
import { screen, cleanup } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { renderWithThemeAndRedux } from '../../../../../testUtils/customRender';
import { mockDatabaseType } from '../../../../../testUtils/mockHooks/mockDatabaseType';
import SQLInfoFormItem from '../SQLInfoFormItem';
import { SQLInfoFormFields, SQLInfoFormItemProps } from '../index.type';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SQLInputType } from '../../../SQLStatementForm';

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
  const setIsSupportFileModeExecuteSQLFn = jest.fn();

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
      auditLoading: false,
      isSupportFileModeExecuteSQL: false,
      setIsSupportFileModeExecuteSQL: setIsSupportFileModeExecuteSQLFn,
      currentSQLInputType: SQLInputType.manualInput,
      setCurrentSQLInputType: jest.fn()
    };
    return renderWithThemeAndRedux(
      <Form>
        <SQLInfoFormItem {...params} />
      </Form>
    );
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
