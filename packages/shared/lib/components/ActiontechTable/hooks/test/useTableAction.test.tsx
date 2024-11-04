import { cleanup, fireEvent, screen } from '@testing-library/react';
import {
  renderHooksWithTheme,
  superRender
} from '../../../../testUtil/customRender';
import useTableAction from '../useTableAction';
import { ButtonProps } from 'antd/lib/button';

export type typeData = { status: string };

describe('lib/ActiontechTable-hooks-useTableAction', () => {
  afterAll(() => {
    cleanup();
    jest.resetAllMocks();
  });
  const mockActions = [
    {
      key: 'add-btn',
      text: <span>增加</span>,
      buttonProps: () =>
        ({
          size: 'middle',
          block: true,
          'data-testid': 'add'
        } as Omit<ButtonProps, 'children'>)
    },
    {
      key: 'delete-btn',
      text: <span>删除</span>,
      buttonProps: () => ({ danger: true, 'data-testid': 'delete' }),
      confirm: () => ({
        title: '删除确认',
        onConfirm: jest.fn()
      }),
      permissions: (data?: typeData) => !!(data?.status === 'ok')
    },
    {
      key: 'edit-btn',
      text: <span>编辑</span>,
      buttonProps: () =>
        ({ type: 'primary', 'data-testid': 'edit' } as ButtonProps),
      link: () => ({
        to: '/'
      }),
      permissions: () => false
    }
  ];
  const mockRecord = {
    status: 'ok'
  };
  describe('-renderAction', () => {
    it('render use renderAction', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderAction(
        mockActions,
        mockRecord
      );

      const TestElement = () => {
        return <>{elementResult}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
      expect(screen.queryByTestId('编辑')).not.toBeInTheDocument();
    });

    it('render btn is disabled', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderAction(
        [
          {
            key: 'add-btn',
            text: <span>增加</span>,
            buttonProps: () => ({
              size: 'middle',
              'data-testid': 'add',
              disabled: true
            })
          }
        ],
        mockRecord
      );
      const TestElement = () => {
        return <>{elementResult}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
      expect(screen.getByTestId('add').closest('button')).toBeDisabled();
    });

    it('render btn click fn', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const onClickSpy = jest.fn();
      const elementResult = result.current.renderAction(
        [
          {
            key: 'add-btn',
            text: <span>增加</span>,
            buttonProps: () => ({
              size: 'middle',
              block: true,
              onClick: onClickSpy,
              'data-testid': 'test-button',
              className: 'test-btn-click'
            })
          }
        ],
        mockRecord
      );

      const TestElement = () => {
        return <>{elementResult}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();

      expect(screen.getByTestId('test-button')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('test-button'));
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('render btn click confirm', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const onConfirmSpy = jest.fn();
      const elementResult = result.current.renderAction(
        [
          {
            key: 'delete-btn',
            text: <span>删除</span>,
            confirm: () => {
              return {
                title: 'confirm的标题',
                onConfirm: onConfirmSpy
              };
            },
            buttonProps: () => ({
              'data-testid': 'test-button'
            })
          }
        ],
        mockRecord
      );

      const TestElement = () => {
        return <>{elementResult}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();

      fireEvent.click(screen.getByTestId('test-button'));

      await screen.findByText('confirm的标题');

      fireEvent.click(screen.getByText('确 认'));
      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    });

    it('render btn when action type is "navigate-link"', () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderAction(
        [
          {
            key: 'edit-btn',
            text: <span>编辑</span>,
            link: () => ({ to: '/home' }),
            buttonProps: () => ({
              size: 'middle',
              block: true,
              'data-testid': 'test-button',
              className: 'test-btn-click'
            })
          }
        ],
        mockRecord
      );

      const TestElement = () => {
        return <>{elementResult}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
      expect(screen.getByTestId('test-button').closest('a')).toHaveAttribute(
        'href',
        '/home'
      );
    });
  });

  describe('-renderActionInTable', () => {
    it('render action when actions is empty', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderActionInTable([]);
      expect(elementResult).toBeNull();
    });

    it('render normal columns', async () => {
      const mockActionData = [
        {
          key: 'add-btn',
          text: <span>增加</span>,
          buttonProps: () =>
            ({
              type: 'primary',
              className: 'button'
            } as Omit<ButtonProps, 'children'>)
        }
      ];
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderActionInTable(mockActionData);

      expect(elementResult).toMatchSnapshot();
    });

    it('render buttons | moreButtons is empty', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderActionInTable({
        buttons: [],
        moreButtons: []
      });
      expect(elementResult).toBeNull();
    });

    it('render buttons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderActionInTable({
        buttons: mockActions,
        moreButtons: []
      });
      expect(elementResult).toMatchSnapshot();
      const TestElement = () => {
        return <>{elementResult?.render?.(null as never, mockRecord, 1)!}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
    });

    it('render moreButtons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
      const elementResult = result.current.renderActionInTable({
        buttons: [],
        moreButtons: [
          {
            key: 'add-btn',
            text: <span>增加</span>,
            permissions: () => false
          },
          {
            key: 'edit-btn',
            text: <span>编辑</span>,
            permissions: () => true
          },
          {
            key: 'delete-btn',
            text: <span>删除</span>,
            confirm: () => {
              return {
                title: '是否删除',
                onConfirm: jest.fn()
              };
            }
          },
          {
            key: 'more',
            text: <span>更多</span>
          }
        ]
      });
      const TestElement = () => {
        return <>{elementResult?.render?.(null as never, mockRecord, 1)!}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
    });

    it('render button & moreButtons', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
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
            onClick: () => {
              jest.fn();
            }
          }
        ]
      });
      const TestElement = () => {
        return <>{elementResult?.render?.(null as never, mockRecord, 1)!}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
    });

    it('render moreButtons when it is a function', async () => {
      const { result } = renderHooksWithTheme(() => useTableAction());
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
      const TestElement = () => {
        return <>{elementResult?.render?.(null as never, mockRecord, 1)!}</>;
      };

      const { container } = superRender(<TestElement />);
      expect(container).toMatchSnapshot();
    });
  });
});
