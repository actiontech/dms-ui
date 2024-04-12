import { superRender } from '../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import project from '../../../../testUtils/mockApi/project';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import dms from '../../../../testUtils/mockApi/global';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { DBServicesList } from '../../../../testUtils/mockApi/global/data';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';

import DataSourceForm from '.';

describe('page/DataSource/DataSourceForm', () => {
  const submitFn = jest.fn();
   let getProjectTipsSpy: jest.SpyInstance;
  const customRender = (params?: {
    isUpdate: boolean;
    defaultData?: IListDBService;
  }) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<DataSourceFormField>()
    );
    const isUpdate = params?.isUpdate ?? false;
    const defaultData = params?.defaultData ?? {};
    return superRender(
      <DataSourceForm
        form={result.current[0]}
        defaultData={defaultData}
        isUpdate={isUpdate}
        submit={submitFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getProjectTipsSpy = project.getProjectTips();
    dms.mockAllApi();
    ruleTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render form snap when isFixedBusiness is true', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render form snap when isFixedBusiness is false', async () => {
    getProjectTipsSpy.mockClear();
    getProjectTipsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [{ is_fixed_business: false }] })
    );
    const { baseElement } = customRender();

    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
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
  });

  it('render change switch when page is update', async () => {
    const singleData = { ...DBServicesList[0], db_type: 'mysql' };
    const { baseElement } = customRender({
      isUpdate: true,
      defaultData: singleData
    });

    const needUpdatePassword = getBySelector(
      '#needUpdatePassword',
      baseElement
    );
    fireEvent.change(needUpdatePassword, {
      target: {
        value: true
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    const needAuditForSqlQuery = getBySelector(
      '#needAuditForSqlQuery',
      baseElement
    );
    fireEvent.change(needAuditForSqlQuery, {
      target: {
        value: true
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    const allowQueryLevel = getBySelector(
      '#allowQueryWhenLessThanAuditLevel',
      baseElement
    );
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
    expect(requestRuleTemplateTip).toHaveBeenCalled();
    expect(requestProjectRuleTemplateTips).toHaveBeenCalled();

    const ruleTemplateId = getBySelector('#ruleTemplateId', baseElement);
    expect(screen.getByText('custom_template_b')).toBeInTheDocument();
    expect(ruleTemplateId).toHaveAttribute(
      'value',
      singleData.sqle_config?.rule_template_id
    );

    const switchEle = getAllBySelector('.ant-switch', baseElement);
    expect(switchEle.length).toBe(4);
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
});
