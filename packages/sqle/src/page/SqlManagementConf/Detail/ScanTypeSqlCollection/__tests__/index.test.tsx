import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instanceAuditPlan from '../../../../../testUtils/mockApi/instanceAuditPlan';
import { superRender } from '../../../../../testUtils/customRender';
import ScanTypeSqlCollection from '../indx';
import { act, fireEvent } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockAuditPlanSQLData } from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('test ScanTypeSqlCollection', () => {
  let getInstanceAuditPlanSQLMetaSpy: jest.SpyInstance;
  let getInstanceAuditPlanSQLDataSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    instanceAuditPlan.mockAllApi();
    getInstanceAuditPlanSQLMetaSpy =
      instanceAuditPlan.getInstanceAuditPlanSQLMeta();
    getInstanceAuditPlanSQLDataSpy =
      instanceAuditPlan.getInstanceAuditPlanSQLData();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const instanceAuditPlanId = '1';
  const auditPlanId = '121343';
  const instanceType = 'MySQL';

  const customRender = () => {
    return superRender(
      <ScanTypeSqlCollection
        instanceAuditPlanId={instanceAuditPlanId}
        auditPlanId={auditPlanId}
        activeTabKey={auditPlanId}
        instanceType={instanceType}
        exportDone={jest.fn()}
        exportPending={jest.fn()}
        auditPlanType="default"
      />
    );
  };
  it('should match snapshot', async () => {
    const { container } = customRender();

    expect(getInstanceAuditPlanSQLMetaSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceAuditPlanSQLMetaSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: auditPlanId
    });
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: auditPlanId,
      page_index: 1,
      page_size: 20,
      filter_list: []
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should render the table filter container with dynamic filter meta', async () => {
    const { getByText } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      getByText('SQL', {
        selector: '.ant-input-prefix'
      })
    ).toBeInTheDocument();

    fireEvent.change(getAllBySelector('.ant-input')[0], {
      target: { value: 'select *' }
    });
    fireEvent.keyDown(getAllBySelector('.ant-input')[0], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });

    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(2);
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenNthCalledWith(2, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: auditPlanId,
      page_index: 1,
      page_size: 20,
      filter_list: [
        {
          filter_compare_value: 'select *',
          filter_name: 'sql'
        }
      ]
    });

    fireEvent.change(getAllBySelector('.ant-input')[0], {
      target: { value: '' }
    });
    fireEvent.keyDown(getAllBySelector('.ant-input')[0], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });

    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(3);
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenNthCalledWith(3, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: auditPlanId,
      page_index: 1,
      page_size: 20,
      filter_list: []
    });
  });

  it('should open report drawer and set current audit result record on audit result click', async () => {
    rule_template.getRuleList();
    const { getAllByTestId, baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getAllByTestId('trigger-open-report-drawer')[0]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should polling request when sql audit status is being_audited', async () => {
    getInstanceAuditPlanSQLDataSpy
      .mockImplementationOnce(() => {
        return createSpySuccessResponse({
          data: {
            rows: [
              {
                ...mockAuditPlanSQLData?.rows?.[0],
                audit_results: '[]',
                audit_status: 'being_audited'
              }
            ]
          }
        });
      })
      .mockImplementationOnce(() => {
        return createSpySuccessResponse({
          data: {
            rows: [
              {
                ...mockAuditPlanSQLData?.rows?.[0]
              }
            ]
          }
        });
      });

    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(2);
  });

  it('should stop polling request when sql audit status is not being_audited', async () => {
    getInstanceAuditPlanSQLDataSpy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: {
          rows: [
            {
              ...mockAuditPlanSQLData?.rows?.[0]
            }
          ]
        }
      });
    });

    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlanSQLDataSpy).toHaveBeenCalledTimes(1);
  });
});
