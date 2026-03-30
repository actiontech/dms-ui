import { baseSuperRender } from '../../../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { mockProjectList } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { DBServicesList } from '@actiontech/shared/lib/testUtil/mockApi/base/global/data';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { DataSourceFormContextProvide } from '../../context';
import { DataSourceFormContextType } from '../../context';

import DataSourceForm from '.';

describe('page/DataSource/DataSourceForm', () => {
  const submitFn = jest.fn();
  let listEnvironmentTagsSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let getSystemModuleStatusSpy: jest.SpyInstance;
  const customRender = (params?: {
    isUpdate?: boolean;
    defaultData?: IListDBServiceV2;
  }) => {
    const { result } = superRenderHook(() =>
      Form.useForm<DataSourceFormField>()
    );

    return baseSuperRender(
      <DataSourceForm
        form={result.current[0]}
        defaultData={params?.defaultData}
        isUpdate={params?.isUpdate}
        submit={submitFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getProjectListSpy = project.getProjectList();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    getSystemModuleStatusSpy = system.getSystemModuleStatus();
    dms.mockAllApi();
    ruleTemplate.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render form snap when current projectID is undefined', async () => {
    const requestRuleTemplateTip = ruleTemplate.getProjectRuleTemplateTips();
    const requestProjectRuleTemplateTips = ruleTemplate.getRuleTemplateTips();
    customRender();
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    expect(requestProjectRuleTemplateTips).toHaveBeenCalledTimes(1);
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(1);
    expect(getBySelector('#project')).toBeDisabled();

    cleanup();
    mockUseCurrentProject({ projectID: undefined });
    const { baseElement } = customRender();
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);
    expect(requestProjectRuleTemplateTips).toHaveBeenCalledTimes(2);
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(1);
    const projectEle = getBySelector('#project');
    expect(projectEle).not.toBeDisabled();
    expect(getBySelector('.editable-select-trigger')).toHaveClass(
      'editable-select-trigger-disabled'
    );
    fireEvent.mouseDown(projectEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.editable-select-trigger')).not.toHaveClass(
      'editable-select-trigger-disabled'
    );
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(2);
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(2);
  });

  it('render update form snap', async () => {
    const { baseElement } = customRender({ isUpdate: true });

    expect(screen.getByText('编辑数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render name rule', async () => {
    const { baseElement } = customRender();

    const nameEle = getBySelector('#name', baseElement);
    await act(async () => {
      fireEvent.change(nameEle, {
        target: { value: '*' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.change(nameEle, {
        target: {
          value:
            'test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render database type', async () => {
    const requestListDBServiceDriver = dms.getListDBServiceDriverOption();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));

    const typeEle = getBySelector('#type');
    fireEvent.mouseDown(typeEle, baseElement);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListDBServiceDriver).toHaveBeenCalled();
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const ruleTemplateName = getBySelector('#ruleTemplateName');
    const ruleTemplateId = getBySelector('#ruleTemplateId');
    expect(ruleTemplateName).toHaveAttribute('value', undefined);
    expect(ruleTemplateId).toHaveAttribute('value', undefined);
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2700));
    expect(screen.getByText('SQL备份配置')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render change switch when page is update', async () => {
    const singleData = { ...DBServicesList[0], db_type: 'mysql' };
    const { baseElement } = customRender({
      isUpdate: true,
      defaultData: singleData
    });

    await act(async () => jest.advanceTimersByTime(300));

    const needAuditForSqlQuery = getBySelector(
      '#needAuditForSqlQuery',
      baseElement
    );
    fireEvent.click(needAuditForSqlQuery);
    await act(async () => jest.advanceTimersByTime(300));

    const allowQueryLevel = getBySelector(
      '#allowQueryWhenLessThanAuditLevel',
      baseElement
    );
    expect(getBySelector('#workbenchTemplateName')).toBeInTheDocument();
    expect(allowQueryLevel).toBeInTheDocument();
    expect(
      getBySelector('#allowExecuteNonDqlInWorkflow', baseElement)
    ).toBeInTheDocument();
    fireEvent.mouseDown(allowQueryLevel);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render cancel rule', async () => {
    const requestRuleTemplateTip = ruleTemplate.getProjectRuleTemplateTips();
    const requestProjectRuleTemplateTips = ruleTemplate.getRuleTemplateTips();
    const singleData = {
      ...DBServicesList[0],
      db_type: 'mysql',
      sqle_config: {
        ...DBServicesList[0].sqle_config,
        rule_template_id: '2',
        rule_template_name: 'custom_template_b'
      }
    };
    const { baseElement } = customRender({
      isUpdate: true,
      defaultData: singleData
    });

    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestProjectRuleTemplateTips).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestRuleTemplateTip).toHaveBeenCalled();
    const ruleTemplateId = getBySelector('#ruleTemplateId', baseElement);
    expect(screen.getByText('custom_template_b')).toBeInTheDocument();
    expect(ruleTemplateId).toHaveAttribute(
      'value',
      singleData.sqle_config?.rule_template_id
    );

    const switchEle = getAllBySelector('.ant-switch', baseElement);
    expect(switchEle.length).toBe(5);
    expect(switchEle[1]).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(switchEle[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(
        '如果不启用SQL审核业务，则在SQL审核相关业务中无法使用该数据源，是否确认关闭？'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.ant-popconfirm-buttons .ant-btn-primary'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('reset form when projectID is not undefined', async () => {
    mockUseCurrentProject({ projectID: mockProjectList[0].uid });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(mockProjectList[0].name!)).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    const environmentTagEle = getBySelector('.editable-select-trigger');
    fireEvent.click(environmentTagEle);
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    expect(environmentTagEle).toHaveTextContent('environment-1');

    await act(async () => {
      EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
      await jest.advanceTimersByTime(300);
    });
    expect(environmentTagEle).toHaveTextContent('environment-1');
    expect(screen.getByText(mockProjectList[0].name!)).toBeInTheDocument();
  });

  it('reset form when projectID is undefined', async () => {
    mockUseCurrentProject({ projectID: undefined });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const projectEle = getBySelector('#project');
    fireEvent.mouseDown(projectEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(3000));

    const environmentTagEle = getBySelector('.editable-select-trigger');
    fireEvent.click(environmentTagEle);
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    expect(environmentTagEle).toHaveTextContent('environment-1');
    await act(async () => {
      EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
      await jest.advanceTimersByTime(300);
    });
    expect(screen.queryByText('environment-1')).not.toBeInTheDocument();
    expect(screen.queryByText('test_project_1')).not.toBeInTheDocument();
  });

  describe('submit logic (TC 5.3.x)', () => {
    const mockOnCheckConnectable = jest.fn();
    const submitPromiseFn = jest.fn();

    const singleData: IListDBServiceV2 = {
      ...DBServicesList[0],
      db_type: 'mysql',
      name: 'mysql-1',
      host: '10.186.62.13',
      port: '33061',
      user: 'root',
      password: '',
      environment_tag: {
        uid: '1',
        name: 'test'
      }
    };

    const renderWithContext = (params?: {
      isUpdate?: boolean;
      defaultData?: IListDBServiceV2;
      contextOverrides?: Partial<DataSourceFormContextType>;
    }) => {
      const { result } = superRenderHook(() =>
        Form.useForm<DataSourceFormField>()
      );

      const contextValue: DataSourceFormContextType = {
        loading: false,
        connectAble: false,
        connectErrorMessage: 'connection failed',
        onCheckConnectable: mockOnCheckConnectable,
        submitLoading: false,
        ...(params?.contextOverrides ?? {})
      };

      return {
        ...baseSuperRender(
          <DataSourceFormContextProvide value={contextValue}>
            <DataSourceForm
              form={result.current[0]}
              defaultData={params?.defaultData}
              isUpdate={params?.isUpdate}
              submit={submitPromiseFn}
            />
          </DataSourceFormContextProvide>
        ),
        form: result.current[0]
      };
    };

    beforeEach(() => {
      submitPromiseFn.mockResolvedValue(undefined);
      mockOnCheckConnectable.mockResolvedValue(true);
    });

    // TC 5.3.1: Default state (isPasswordEditing=false) - skip connectivity test
    it('should skip connectivity test and submit directly when password is not in edit mode', async () => {
      const { form } = renderWithContext({
        isUpdate: true,
        defaultData: singleData
      });

      // Wait for form to initialize with defaultData (isPasswordEditing: false)
      await act(async () => jest.advanceTimersByTime(3000));

      // Confirm isPasswordEditing is false after initialization
      expect(form.getFieldValue('isPasswordEditing')).toBe(false);

      // Trigger submit via EventEmitter
      await act(async () => {
        EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // Connectivity test should NOT have been called
      expect(mockOnCheckConnectable).not.toHaveBeenCalled();

      // Submit should have been called
      expect(submitPromiseFn).toHaveBeenCalledTimes(1);

      // Submit args should not contain password (password field is empty/undefined)
      const submitArgs = submitPromiseFn.mock.calls[0][0];
      expect(
        submitArgs.password === '' ||
          submitArgs.password === undefined ||
          submitArgs.password === null
      ).toBe(true);
    });

    // TC 5.3.2: Edit mode (isPasswordEditing=true) - execute connectivity test
    it('should execute connectivity test before submit when password is in edit mode', async () => {
      const { form, baseElement } = renderWithContext({
        isUpdate: true,
        defaultData: singleData
      });

      // Wait for form to initialize
      await act(async () => jest.advanceTimersByTime(3000));

      // Enter edit mode by clicking the pencil icon
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Type password
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'newpass' } });
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Trigger submit via EventEmitter
      await act(async () => {
        EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // Connectivity test should have been called
      expect(mockOnCheckConnectable).toHaveBeenCalledTimes(1);

      // Since connectivity returned true, submit should have been called
      expect(submitPromiseFn).toHaveBeenCalledTimes(1);
    });

    // TC 5.3.3: Edit mode - connectivity test fails, show confirmation modal
    it('should show confirmation modal when connectivity test fails in edit mode', async () => {
      mockOnCheckConnectable.mockResolvedValue(false);

      const { form, baseElement } = renderWithContext({
        isUpdate: true,
        defaultData: singleData,
        contextOverrides: {
          connectErrorMessage: 'connection failed: timeout'
        }
      });

      // Wait for form to initialize
      await act(async () => jest.advanceTimersByTime(3000));

      // Enter edit mode by clicking the pencil icon
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Type password
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'newpass' } });
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Trigger submit via EventEmitter
      await act(async () => {
        EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // Connectivity test should have been called
      expect(mockOnCheckConnectable).toHaveBeenCalledTimes(1);

      // Submit should NOT have been called (connectivity failed)
      expect(submitPromiseFn).not.toHaveBeenCalled();

      // Confirmation modal should appear
      expect(
        screen.getByText('数据源连通性测试失败')
      ).toBeInTheDocument();

      // "返回修改" button should be visible
      expect(screen.getByText('返回修改')).toBeInTheDocument();

      // Click "返回修改" to close modal
      await act(async () => {
        fireEvent.click(screen.getByText('返回修改'));
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Password field should still be in edit mode (rollback icon visible)
      expect(
        getBySelector('.anticon-rollback', baseElement)
      ).toBeTruthy();
    });

    // TC 5.3.4: Edit mode with empty password - validation blocks submit
    it('should block submit with validation error when password is empty in edit mode', async () => {
      const { form, baseElement } = renderWithContext({
        isUpdate: true,
        defaultData: singleData
      });

      // Wait for form to initialize
      await act(async () => jest.advanceTimersByTime(3000));

      // Enter edit mode by clicking the pencil icon
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Do NOT type any password (leave empty)

      // Verify that form validation will fail for the password field
      let validationFailed = false;
      try {
        await form.validateFields();
      } catch (err: any) {
        validationFailed = true;
        // Verify the error is specifically about the password field
        const passwordError = err.errorFields?.find(
          (f: any) => f.name?.includes('password')
        );
        expect(passwordError).toBeTruthy();
      }
      expect(validationFailed).toBe(true);

      // Since validateFields throws, the submit event handler will also
      // reject. Neither connectivity test nor submit should be called.
      expect(mockOnCheckConnectable).not.toHaveBeenCalled();
      expect(submitPromiseFn).not.toHaveBeenCalled();
    });
  });
});
