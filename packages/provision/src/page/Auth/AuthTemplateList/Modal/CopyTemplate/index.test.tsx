import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import {
  AuthTemplateListSelectData,
  AuthTemplateModalStatus
} from '~/store/auth/templateList';
import auth from '~/testUtil/mockApi/auth';
import SyncRecoil, { setRecoil } from '~/utils/SyncRecoil';
import CopyTemplate from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';

describe('CopyTemplate', () => {
  const customRender = (defaultVisible = true) => {
    return superRender(
      <>
        <SyncRecoil />
        <CopyTemplate />,
      </>,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(AuthTemplateModalStatus, {
              [ModalName.CopyTemplate]: defaultVisible
            });
            set(AuthTemplateListSelectData, {
              name: 'temp-1',
              uid: '123'
            });
          }
        }
      }
    );
  };
  let copyDataPermissionTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    copyDataPermissionTemplateSpy = auth.copyDataPermissionTemplate();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should match close modal when modal status is false', async () => {
    const { container } = customRender(false);
    expect(container).toMatchInlineSnapshot(`
      <div>
        ,
      </div>
    `);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = customRender();
    await screen.findByText('类似创建');
    expect(baseElement).toMatchSnapshot();
  });

  it('should reset all fields when user close modal', async () => {
    const { baseElement } = customRender();
    await act(() => jest.advanceTimersByTime(1000));
    fireEvent.input(screen.getByLabelText('权限模板名称'), {
      target: { value: 'new-temp-1' }
    });
    await act(() => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关 闭'));
    await act(() => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
  });

  it('should add template when user input all fields and click submit button', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.input(screen.getByLabelText('权限模板名称'), {
      target: { value: 'new-temp-1' }
    });
    await act(() => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('提 交'));
    await act(() => jest.advanceTimersByTime(100));
    expect(copyDataPermissionTemplateSpy).toHaveBeenCalledWith({
      data_permission_template_uid: '123',
      new_template: {
        name: 'new-temp-1'
      }
    });
    expect(screen.getByText('关 闭').parentElement).toBeDisabled();
    expect(screen.getByText('提 交').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText(`创建权限模板成功！`);

    // modal visible 变为false之后，不会再响应update，所以必须重新打开modal之后下面这两个btn才会变成可用状态
    act(() => {
      setRecoil(AuthTemplateModalStatus, { [ModalName.CopyTemplate]: true });
    });

    expect(screen.getByText('关 闭').parentElement).not.toBeDisabled();
    expect(screen.getByText('提 交').parentElement).not.toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText(`更新成功！`)).not.toBeInTheDocument();
  });
});
