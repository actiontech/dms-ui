import { act, cleanup } from '@testing-library/react';
import { renderHooksWithTheme } from '../../../../testUtil/customRender';

import useTableAction from '../useTableAction';
import { ButtonProps } from 'antd/lib/button';

export type typeData = { status: string };

describe('lib/ActiontechTable-hooks-useTableAction', () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });
  describe('-renderAction', () => {
    const conformFn = jest.fn();
    const mockActions = [
      {
        key: 'add-btn',
        text: <span>增加</span>,
        buttonProps: () =>
          ({
            size: 'middle',
            block: true
          } as Omit<ButtonProps, 'children'>)
      },
      {
        key: 'delete-btn',
        text: <span>删除</span>,
        buttonProps: () => ({ danger: true }),
        confirm: () => ({
          title: '删除确认',
          onConfirm: conformFn
        }),
        permissions: (data?: typeData) => !!(data?.status === 'ok')
      }
    ];
    const mockRecord = {
      status: 'ok'
    };

    it('render use renderAction', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderAction(
          mockActions,
          mockRecord
        );
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render btn is disabled', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderAction(
          [
            {
              key: 'add-btn',
              text: <span>增加</span>,
              buttonProps: () =>
                ({
                  size: 'middle',
                  block: true,
                  disabled: true
                } as Omit<ButtonProps, 'children'>)
            }
          ],
          mockRecord
        );
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render btn click fn', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderAction(
          [
            {
              key: 'add-btn',
              text: <span>增加</span>,
              buttonProps: () =>
                ({
                  size: 'middle',
                  block: true,
                  onClick: jest.fn(),
                  className: 'test-btn-click'
                } as Omit<ButtonProps, 'children'>)
            }
          ],
          mockRecord
        );
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render btn click confirm', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderAction(
          [
            {
              key: 'delete-btn',
              text: <span>删除</span>,
              buttonProps: () =>
                ({
                  size: 'middle',
                  block: true,
                  confirm: () => {
                    return {
                      title: 'confirm的标题',
                      onConfirm: jest.fn()
                    };
                  }
                } as Omit<ButtonProps, 'children'>)
            }
          ],
          mockRecord
        );
        expect(elementResult).toMatchSnapshot();
      });
    });
  });

  describe('-renderActionInTable', () => {
    it('render action when actions is empty', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable([]);
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render normal columns', async () => {
      const mockActionData = [
        {
          key: 'add-btn',
          text: <span>增加</span>,
          buttonProps: () =>
            ({
              size: 'middle',
              block: true
            } as Omit<ButtonProps, 'children'>)
        }
      ];
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult =
          result.current.renderActionInTable(mockActionData);
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render buttons | moreButtons is empty', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable({
          buttons: [],
          moreButtons: []
        });
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render buttons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable({
          buttons: [
            {
              key: 'add-btn',
              text: <span>增加</span>,
              buttonProps: () =>
                ({
                  size: 'middle',
                  block: true
                } as Omit<ButtonProps, 'children'>)
            }
          ],
          moreButtons: []
        });
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render moreButtons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable({
          buttons: [],
          moreButtons: [
            {
              key: 'add-btn',
              text: <span>增加</span>
            }
          ]
        });
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render button & moreButtons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable({
          buttons: [
            {
              key: 'add-btn',
              text: <span>增加</span>
            }
          ],
          moreButtons: [
            {
              key: 'delete-btn2',
              text: <span>删除2</span>,
              icon: <></>,
              onClick: (record) => {
                jest.fn();
              }
            }
          ]
        });
        expect(elementResult).toMatchSnapshot();
      });
    });

    it('render moreButtons when it is a function', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      await act(async () => {
        const elementResult = result.current.renderActionInTable({
          buttons: [
            {
              key: 'add-btn',
              text: <span>增加</span>
            }
          ],
          moreButtons: () => {
            return [
              {
                key: 'delete-btn2',
                text: <span>函数moreButtons</span>,
                icon: <></>,
                onClick: (record) => {
                  jest.fn();
                }
              }
            ];
          }
        });
        expect(elementResult).toMatchSnapshot();
        expect(elementResult?.render?.(1, {}, 1)).toMatchSnapshot();
      });
    });
  });
});
