import { renderHook, act, cleanup } from '@testing-library/react';
import useTableFilterContainer from '../useTableFilterContainer';

describe('lib/ActiontechTable-hooks-useTableFilterContainer', () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('render do not have extraFilterMeta', async () => {
    const UpdateTableFilterInfoTypeFn = jest.fn();
    const { result } = renderHook(() =>
      useTableFilterContainer(
        [
          {
            dataIndex: 'demo1',
            key: 'demo1',
            title: 'demo1'
          },
          {
            dataIndex: 'demo2',
            key: 'demo2',
            title: 'demo2'
          }
        ],
        UpdateTableFilterInfoTypeFn
      )
    );
    await act(() => {
      const filterButtonMeta = result.current.filterButtonMeta;
      expect(filterButtonMeta).toEqual(new Map());
    });
    await act(() => {
      const filterContainerMeta = result.current.filterContainerMeta;
      expect(filterContainerMeta).toEqual([]);
    });
  });

  it('render have extraFilterMeta', async () => {
    const UpdateTableFilterInfoTypeFn = jest.fn();
    const { result } = renderHook(() =>
      useTableFilterContainer(
        [
          {
            dataIndex: 'demo1',
            key: 'demo1',
            title: 'demo1'
          },
          {
            dataIndex: 'demo2',
            key: 'demo2',
            title: 'demo2'
          }
        ],
        UpdateTableFilterInfoTypeFn,
        new Map([
          [
            'filter_fuzzy_text',
            {
              filterCustomType: 'search-input',
              filterKey: 'filter_fuzzy_text',
              checked: true
            }
          ],
          [
            'filter_text',
            {
              filterCustomType: 'input',
              filterKey: 'filter_text',
              filterLabel: '模糊筛选',
              checked: false
            }
          ]
        ])
      )
    );
    await act(() => {
      const filterButtonMeta = result.current.filterButtonMeta;
      expect(filterButtonMeta).toEqual(
        new Map([
          [
            'filter_fuzzy_text',
            {
              filterCustomType: 'search-input',
              filterLabel: '',
              checked: true
            }
          ],
          [
            'filter_text',
            {
              filterCustomType: 'input',
              filterLabel: '模糊筛选',
              checked: false
            }
          ]
        ])
      );
    });
    await act(() => {
      const filterContainerMeta = result.current.filterContainerMeta;
      expect(filterContainerMeta).toEqual([
        {
          dataIndex: 'filter_fuzzy_text',
          filterCustomType: 'search-input',
          filterKey: 'filter_fuzzy_text',
          filterLabel: ''
        }
      ]);
    });
  });

  // - updateAllSelectedFilterItem
  it('render updateAllSelectedFilterItem do not have extraFilterMeta', async () => {
    const UpdateTableFilterInfoTypeFn = jest.fn();
    const { result } = renderHook(() =>
      useTableFilterContainer(
        [
          {
            dataIndex: 'demo1',
            key: 'demo1',
            title: 'demo1'
          },
          {
            dataIndex: 'demo2',
            key: 'demo2',
            title: 'demo2'
          }
        ],
        UpdateTableFilterInfoTypeFn,
        new Map([
          [
            'filter_fuzzy_text',
            {
              filterCustomType: 'search-input',
              filterKey: 'filter_fuzzy_text'
            }
          ],
          [
            'filter_text',
            {
              filterCustomType: 'input',
              filterKey: 'filter_text',
              filterLabel: '模糊筛选'
            }
          ]
        ])
      )
    );
    await act(() => {
      result.current.updateAllSelectedFilterItem(true);
      const filterContainerMeta = result.current.filterContainerMeta;
      expect(UpdateTableFilterInfoTypeFn).toHaveBeenCalledTimes(1);
      expect(filterContainerMeta).toEqual([]);
    });

    await act(() => {
      result.current.updateAllSelectedFilterItem(false);
      const filterContainerMeta = result.current.filterContainerMeta;
      expect(filterContainerMeta).toEqual([
        {
          dataIndex: 'filter_fuzzy_text',
          filterCustomType: 'search-input',
          filterKey: 'filter_fuzzy_text',
          filterLabel: ''
        },
        {
          dataIndex: 'filter_text',
          filterCustomType: 'input',
          filterKey: 'filter_text',
          filterLabel: '模糊筛选'
        }
      ]);
    });
  });

  // - filterOrder sorting
  it('render filterContainerMeta with correct filterOrder sorting', async () => {
    const UpdateTableFilterInfoTypeFn = jest.fn();
    const { result } = renderHook(() =>
      useTableFilterContainer(
        [
          {
            dataIndex: 'demo1',
            key: 'demo1',
            title: 'demo1',
            filterCustomType: 'input',
            filterKey: 'demo1_key',
            filterOrder: 3
          },
          {
            dataIndex: 'demo2',
            key: 'demo2',
            title: 'demo2',
            filterCustomType: 'select',
            filterKey: 'demo2_key',
            filterOrder: 1
          },
          {
            dataIndex: 'demo3',
            key: 'demo3',
            title: 'demo3',
            filterCustomType: 'input',
            filterKey: 'demo3_key'
          }
        ],
        UpdateTableFilterInfoTypeFn,
        new Map([
          [
            'filter_extra',
            {
              filterCustomType: 'input',
              filterKey: 'filter_extra_key',
              filterLabel: '额外筛选',
              filterOrder: 2,
              checked: true
            }
          ]
        ])
      )
    );

    await act(() => {
      result.current.updateFilterButtonMeta((prevMeta) => {
        const newMeta = new Map(prevMeta);
        newMeta.set('demo1', {
          checked: true,
          filterLabel: 'demo1',
          filterCustomType: 'input'
        });
        newMeta.set('demo2', {
          checked: true,
          filterLabel: 'demo2',
          filterCustomType: 'select'
        });
        newMeta.set('demo3', {
          checked: true,
          filterLabel: 'demo3',
          filterCustomType: 'input'
        });
        return newMeta;
      });
    });

    await act(() => {
      const filterContainerMeta = result.current.filterContainerMeta;
      expect(filterContainerMeta).toEqual([
        {
          dataIndex: 'demo3',
          filterCustomType: 'input',
          filterKey: 'demo3_key',
          filterLabel: 'demo3',
          filterOrder: undefined
        },
        {
          dataIndex: 'demo2',
          filterCustomType: 'select',
          filterKey: 'demo2_key',
          filterLabel: 'demo2',
          filterOrder: 1
        },
        {
          dataIndex: 'filter_extra',
          filterCustomType: 'input',
          filterKey: 'filter_extra_key',
          filterLabel: '额外筛选',
          filterOrder: 2
        },
        {
          dataIndex: 'demo1',
          filterCustomType: 'input',
          filterKey: 'demo1_key',
          filterLabel: 'demo1',
          filterOrder: 3
        }
      ]);
    });
  });
});
