import SqlBackupSwitcher from '../components/SqlBackupSwitcher';
import { fireEvent, renderHook, screen, act } from '@testing-library/react';
import { Form } from 'antd';
import { SqlBackupSwitcherProps } from '../components/index.type';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test SqlBackupSwitcher', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  const mockDatabaseInfo = [
    {
      key: '1',
      instanceName: 'mysql-1',
      schemaName: 'test',
      enableBackup: true,
      allowBackup: true,
      backupMaxRows: 2000
    },
    {
      key: '2',
      instanceName: 'mysql-2',
      schemaName: 'test2',
      enableBackup: false,
      allowBackup: true,
      backupMaxRows: 3000
    }
  ];

  const customRender = (
    databaseInfo: SqlBackupSwitcherProps['databaseInfo'],
    isSameSqlForAll = false,
    isAtRejectStep = false,
    isAuditing = false,
    isAtFormStep = true,
    search = ''
  ) => {
    const { result } = renderHook(() => Form.useForm());
    return sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlBackupSwitcher
          fieldPrefixPath="1"
          databaseInfo={databaseInfo}
          isSameSqlForAll={isSameSqlForAll}
          isAtRejectStep={isAtRejectStep}
          isAuditing={{ set: jest.fn(), value: isAuditing }}
          isAtFormStep={isAtFormStep}
        />
      </Form>,
      undefined,
      {
        routerProps: {
          initialEntries: [
            {
              search
            }
          ]
        }
      }
    );
  };

  it('render init snap', () => {
    const { baseElement } = customRender([]);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('是否选择开启备份')).not.toBeInTheDocument();
  });

  it('render switch when isAtRejectStep is true', () => {
    const { baseElement } = customRender(mockDatabaseInfo, false, true);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByRole('switch')).toHaveAttribute('disabled');
  });

  it('render default checked when isSameSqlForAll is true', async () => {
    const { baseElement } = customRender(mockDatabaseInfo, true);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'true'
    );
    expect(screen.getByText('回滚行数限制')).toBeInTheDocument();
    expect(getBySelector('.ant-input-number-input')).toBeDisabled();
    expect(getBySelector('.ant-input-number-input')).toHaveValue('2000');
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('button'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('mysql-1已开启备份需求，是否确认关闭备份？'));
    fireEvent.click(screen.getByText('确 认'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
    expect(screen.queryByText('回滚行数限制')).not.toBeInTheDocument();
  });

  it('render default checked when isAtFormStep is false', async () => {
    customRender(mockDatabaseInfo, true, false, false, false);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isSameSqlForAll is true and isAuditing is true', async () => {
    customRender(mockDatabaseInfo, true, false, true);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isSameSqlForAll is true and isCloneMode is true', async () => {
    customRender(
      mockDatabaseInfo,
      true,
      false,
      false,
      true,
      '?sourceWorkflowId=111'
    );
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isSameSqlForAll is false', async () => {
    const { baseElement } = customRender(mockDatabaseInfo);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'true'
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('button'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText('当前应用的数据源已开启备份需求，是否确认关闭备份？')
    );
    fireEvent.click(screen.getByText('确 认'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render snap when database is not allow backup', async () => {
    const { baseElement } = customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: false,
          allowBackup: false
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false,
          allowBackup: false
        }
      ],
      true
    );
    expect(screen.queryByText('是否选择开启备份')).not.toBeInTheDocument();
    expect(screen.queryByText('回滚行数限制')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when database allow backup but not enable backup', async () => {
    const { baseElement } = customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: false,
          allowBackup: true
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false,
          allowBackup: true
        }
      ],
      true
    );
    expect(screen.getByText('是否选择开启备份')).toBeInTheDocument();
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
    expect(screen.queryByText('回滚行数限制')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('button'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'true'
    );
    expect(screen.getByText('回滚行数限制')).toBeInTheDocument();
    expect(getBySelector('.ant-input-number-input')).not.toBeDisabled();
    expect(getBySelector('.ant-input-number-input')).toHaveValue('1000');
  });
});
