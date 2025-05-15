import { Form } from 'antd';
import SqlStatementFormController from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { fireEvent, renderHook, screen } from '@testing-library/react';
import { SqlStatementFormControllerProps } from '../index.type';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('test SqlStatementFormController', () => {
  const onChange = jest.fn();

  const customRender = (params: Partial<SqlStatementFormControllerProps>) => {
    const { result } = renderHook(() => Form.useForm());
    return sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlStatementFormController
          activeKey="1"
          onChange={onChange}
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={jest.fn()}
          isSameSqlForAll
          databaseInfo={[
            { key: '1', instanceName: 'mysql-1', schemaName: 'test' }
          ]}
          isAtFormStep
          {...params}
        />
      </Form>
    );
  };

  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('matches snapshot with same SQL mode enabled', () => {
    const { container } = customRender({ isSameSqlForAll: true });

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with different SQL mode and no data sources', () => {
    const { container } = customRender({
      isSameSqlForAll: false,
      databaseInfo: []
    });

    expect(container).toMatchSnapshot();
    expect(screen.getByText('请添加数据源')).toBeInTheDocument();
  });

  it('matches snapshot with different SQL mode and data sources', () => {
    const { container } = customRender({
      isSameSqlForAll: false,
      databaseInfo: [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: true,
          allowBackup: true,
          backupMaxRows: 2000
        },
        { key: '2', instanceName: 'mysql-2' }
      ],
      activeKey: '2'
    });

    expect(container).toMatchSnapshot();

    expect(screen.getByText('mysql-2').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );

    fireEvent.click(screen.getByText('mysql-1-test'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
