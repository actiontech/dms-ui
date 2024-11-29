import SqlBackupSwitcher from '../components/SqlBackupSwitcher';
import { fireEvent, renderHook, screen, act } from '@testing-library/react';
import { Form } from 'antd';
import { SqlBackupSwitcherProps } from '../components/index.type';
import { superRender } from '../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test SqlBackupSwitcher', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  const customRender = (
    databaseInfo: SqlBackupSwitcherProps['databaseInfo'],
    isSameSqlForAll = false,
    isAtRejectStep = false,
    isAuditing = false,
    isAtFormStep = true,
    search = ''
  ) => {
    const { result } = renderHook(() => Form.useForm());
    return superRender(
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
    expect(screen.getByText('是否选择开启备份')).toBeInTheDocument();
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render switch when isAtRejectStep is true', () => {
    const { baseElement } = customRender([], false, true);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByRole('switch')).toHaveAttribute('disabled');
  });

  it('render default checked when isSameSqlForAll is true', async () => {
    const { baseElement } = customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: true
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false
        }
      ],
      true
    );
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'true'
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('button'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('mysql-1已开启备份需求，是否确认关闭备份？'));
    fireEvent.click(screen.getByText('确 认'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isAtFormStep is false', async () => {
    customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: true
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false
        }
      ],
      true,
      false,
      false,
      false
    );
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isSameSqlForAll is true and isAuditing is true', async () => {
    customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: true
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false
        }
      ],
      true,
      false,
      true
    );
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'false'
    );
  });

  it('render default checked when isSameSqlForAll is true and isCloneMode is true', async () => {
    customRender(
      [
        {
          key: '1',
          instanceName: 'mysql-1',
          schemaName: 'test',
          enableBackup: true
        },
        {
          key: '2',
          instanceName: 'mysql-2',
          schemaName: 'test2',
          enableBackup: false
        }
      ],
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
    const { baseElement } = customRender([
      {
        key: '1',
        instanceName: 'mysql-1',
        schemaName: 'test',
        enableBackup: true
      },
      {
        key: '2',
        instanceName: 'mysql-2',
        schemaName: 'test2',
        enableBackup: false
      }
    ]);
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
});
