import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import { useSelector } from 'react-redux';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { renderWithThemeAndRedux } from '../../../../../testUtils/customRender';

import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { driverMeta } from '../../../../../hooks/useDatabaseType/index.test.data';
import instance from '../../../../../testUtils/mockApi/instance';
import { InstanceTipList } from '../../../../../testUtils/mockApi/instance/data';

import { DatabaseInfoProps, SQLInfoFormFields } from '../index.type';
import DatabaseInfo from '../DatabaseInfo';
import { getAllBySelector, getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Order/Create/DatabaseInfo', () => {
  const projectName = mockProjectInfo.projectName;
  const projectID = mockProjectInfo.projectID;
  const instanceNameChangeFn = jest.fn();
  const setInstanceInfoFn = jest.fn();
  const setSchemaListFn = jest.fn();
  const setRuleTemplatesFn = jest.fn();
  const setChangeSqlModeDisabledFn = jest.fn();
  let requestConnectCheck: jest.SpyInstance;
  let requestInstanceTip: jest.SpyInstance;
  let requestInstanceSchemas: jest.SpyInstance;
  let requestInstance: jest.SpyInstance;

  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SQLInfoFormFields>()
    );
    const params: Omit<DatabaseInfoProps, 'form'> = {
      instanceNameChange: instanceNameChangeFn,
      projectName,
      projectID,
      setInstanceInfo: setInstanceInfoFn,
      schemaList: new Map([[0, ['schema1']]]),
      setSchemaList: setSchemaListFn,
      ruleTemplates: new Map([[0, { dbType: 'dbType1' }]]),
      setRuleTemplates: setRuleTemplatesFn,
      setChangeSqlModeDisabled: setChangeSqlModeDisabledFn
    };
    return renderWithThemeAndRedux(
      <Form>
        <DatabaseInfo {...params} form={result.current[0]} />
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
    requestConnectCheck = instance.batchCheckInstanceIsConnectableByName();
    requestInstanceTip = instance.getInstanceTipList();
    requestInstanceSchemas = instance.getInstanceSchemas();
    requestInstance = instance.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render DatabaseInfo snap', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render action add data source item', async () => {
    const { baseElement } = customRender();
    expect(screen.getByText('数据源')).toBeInTheDocument();
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(screen.getByText('测试数据库连通性')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstanceTip).toBeCalled();
    const instanceLine = getAllBySelector(
      '.ant-space.ant-space-horizontal .ant-select-selector',
      baseElement
    );
    expect(instanceLine.length).toBe(1 * 2);

    fireEvent.click(screen.getByText('添加数据源'));
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render data source select change', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstanceTip).toBeCalled();
    expect(requestInstanceTip).toBeCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });

    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(600));
    expect(baseElement).toMatchSnapshot();
    const instanceNameLabel = `${InstanceTipList[0].instance_name}(${InstanceTipList[0].host}:${InstanceTipList[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3300));
    });

    expect(requestInstanceSchemas).toBeCalled();
    expect(requestInstanceSchemas).toBeCalledWith({
      instance_name: InstanceTipList[0].instance_name,
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstance).toBeCalled();
    expect(requestInstance).toBeCalledWith({
      instance_name: InstanceTipList[0].instance_name,
      project_name: projectName
    });
    expect(baseElement).toMatchSnapshot();

    const SchemaNameEle = getBySelector(
      '#dataBaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(600));

    const spaceItems = getAllBySelector('.ant-space-item button', baseElement);
    expect(spaceItems.length).toBe(4);
    fireEvent.mouseOver(spaceItems[2]);
    await act(async () => jest.advanceTimersByTime(400));
    expect(baseElement).toMatchSnapshot();

    const deleteBtn = getAllBySelector('.data-source-row-button', baseElement);
    expect(deleteBtn.length).toBe(1);
    fireEvent.click(deleteBtn[0]);
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render action test connect btn', async () => {
    const { baseElement } = customRender();
    expect(screen.getByText('测试数据库连通性')).toBeInTheDocument();

    fireEvent.click(screen.getByText('测试数据库连通性'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestConnectCheck).toBeCalled();
  })
});
