import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import SqlAuditInfoFormItem from '..';
import { superRender } from '../../../../../../../../testUtils/customRender';
import execWorkflow from '../../../../../../../../testUtils/mockApi/execWorkflow';
import { MockSharedStepDetail } from '../../../../../hooks/mockData';
import { SharedStepDetails } from '../../../../../index.type';
import { Form } from 'antd';
import { act, renderHook } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test sqle/SqlAuditInfoForm', () => {
  const customRender = (params: SharedStepDetails) => {
    const { result } = renderHook(() => Form.useForm());
    return superRender(
      <Form form={result.current[0]}>
        <SqlAuditInfoFormItem
          auditAction={jest.fn()}
          handleInstanceNameChange={jest.fn()}
          {...params}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    execWorkflow.mockAllApi();
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    (useSelector as jest.Mock).mockImplementation(() => jest.fn());
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should disable the selection of the same SQL switch when isDisabledForDifferenceSql is equal true', () => {
    const { container } = customRender({
      ...MockSharedStepDetail,
      isDisabledForDifferenceSql: { set: jest.fn(), value: true }
    });

    expect(container.querySelector('#isSameSqlForAll')).toBeDisabled();
  });

  it('should disable switch to false with multiple database source types', () => {
    customRender({
      ...MockSharedStepDetail,
      dbSourceInfoCollection: {
        set: jest.fn(),
        value: {
          '0': {
            dbType: 'MySQL'
          },
          '1': {
            dbType: 'Oracle'
          }
        }
      }
    });

    expect(
      MockSharedStepDetail.isDisabledForDifferenceSql.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.isDisabledForDifferenceSql.set
    ).toHaveBeenCalledWith(true);
  });
});
