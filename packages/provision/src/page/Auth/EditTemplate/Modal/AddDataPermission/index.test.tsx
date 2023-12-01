import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import { AuthDataPermissionListModalStatus } from '~/store/auth/templateList';
import { getAllBySelector, getBySelector, sleep } from '~/testUtil/customQuery';
import { superRender } from '~/testUtil/customRender';
import AddDataPermission from '.';
import { IAddDataPermission } from './index.d';
import auth from '~/testUtil/mockApi/auth';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

const defaultDataPermissions = [
  {
    serviceLabel: 'Julian Lueilwitz',
    objectsLabel: ['database-2.*'],
    operationsLabel: ['查询'],

    business: 'business-1',
    serviceValue: '42343',
    objectsValue: [{ database: '2', tables: undefined }],
    operationsValue: ['72999044'],

    objectsParams: []
  }
];

describe.skip('/Auth/AddDataPermission', () => {
  let listBusinessesSpy: jest.SpyInstance;
  let listServicesSpy: jest.SpyInstance;
  let listDataBasesSpy: jest.SpyInstance;
  let listTablesSpy: jest.SpyInstance;
  let listOperationSetsSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    listBusinessesSpy = auth.listBusinesses();
    listServicesSpy = auth.listServices();
    listDataBasesSpy = auth.listDataBases();
    listTablesSpy = auth.listTables();
    listOperationSetsSpy = auth.listOperationSets();

    jest.useFakeTimers();
    window.confirm = jest.fn();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  const customRender = (
    defaultVisible = true,
    props?: Partial<IAddDataPermission>
  ) => {
    return superRender(
      <AddDataPermission
        dataPermissions={defaultDataPermissions}
        setDataPermissions={jest.fn()}
        setEditIndex={jest.fn()}
        {...props}
      />,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(AuthDataPermissionListModalStatus, {
              [ModalName.DataPermissionModal]: defaultVisible
            });
          }
        }
      }
    );
  };
  it('should match close modal when modal status is false', async () => {
    const { container } = customRender(false);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = customRender();
    await screen.findByText('添加数据权限');

    expect(baseElement).toMatchSnapshot();
  });

  it('this option should be disabled and update table list when select database', async () => {
    customRender(true, {
      dataPermissions: [
        {
          serviceLabel: 'Julian Lueilwitz',
          objectsLabel: ['*'],
          operationsLabel: ['查询'],

          business: 'business-1',
          serviceValue: '42343',
          objectsValue: [{}],
          operationsValue: ['72999044'],

          objectsParams: []
        }
      ],
      editIndex: 0
    });

    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-2', 1);
    await act(async () => jest.advanceTimersByTime(300));
    expect(listServicesSpy).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector('.data-service-select .ant-select-selector input')
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(() =>
      fireEvent.click(screen.getAllByText('Julian Lueilwitz(MySQL)')[0])
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(listDataBasesSpy).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector('.database-form-item .ant-col-8 .ant-select-selector input')
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(() => fireEvent.click(screen.getByText('database-1')));
    await act(async () => jest.advanceTimersByTime(300));
    expect(listTablesSpy).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector(
        '.database-form-item .ant-col-15 .ant-select-selector input'
      )
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('table-1')).toBeInTheDocument();
  });
  it('should push dataPermissions when click add button', async () => {
    const setDataPermissions = jest.fn();
    customRender(true, {
      setDataPermissions,
      editIndex: 0
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    expect(setDataPermissions).toBeCalledTimes(0);
    expect(listDataBasesSpy).toBeCalledTimes(1);
    await screen.findByText(
      '已存在相同数据源、相同数据对象、相同数据操作的权限'
    );
    await act(async () => jest.advanceTimersByTime(200));

    fireEvent.mouseDown(
      getBySelector('.database-form-item .ant-col-8 .ant-select-selector input')
    );
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('database-2')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector(
        '.database-form-item .ant-col-15 .ant-select-selector input'
      )
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(() => fireEvent.click(screen.getByText('table-1')));
    await act(() => fireEvent.click(getBySelector('.add-object-button')));
    await act(() =>
      fireEvent.click(
        getAllBySelector(
          '.database-form-item .ant-col-8 .ant-select-selector input'
        )[1]
      )
    );
    await act(() => fireEvent.click(screen.getAllByText('database-2')[1]));
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('选择操作', '查询', 0);

    await act(() => fireEvent.click(screen.getByText('提 交')));
    expect(setDataPermissions).toBeCalledTimes(1);
  });

  it('remove table options when click remove database field icon', async () => {
    customRender(true, {
      editIndex: 0
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector(
        '.database-form-item .ant-col-15 .ant-select-selector input'
      )
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(3000));
    const el = await screen.findByText('table-1');
    expect(el).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-select-clear'));
    await act(async () => jest.advanceTimersByTime(300));
    // fireEvent.mouseDown(
    //   getBySelector('.database-form-item .ant-col-8 .ant-select-selector input')
    // );
    // expect(screen.queryByText('table-1')).not.toBeInTheDocument();
    // const emptyElement = await getBySelector('.ant-select-item-empty');
    // expect(emptyElement).toBeInTheDocument();
  });

  it('remove data_objects field when click remove field button', async () => {
    customRender();
    fireEvent.click(getBySelector('.add-object-button'));
    const objectFieldsDom = getAllBySelector('.database-form-item');
    expect(objectFieldsDom.length).toBe(2);
    fireEvent.click(getBySelector('.remove-object-button'));
    const newObjectFieldsDom = getAllBySelector('.database-form-item');
    expect(newObjectFieldsDom.length).toBe(1);
  });
});
