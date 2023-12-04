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
      expect(UpdateTableFilterInfoTypeFn).toBeCalledTimes(1);
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
});
