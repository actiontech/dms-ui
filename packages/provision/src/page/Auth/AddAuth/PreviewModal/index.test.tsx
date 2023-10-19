import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';

import PreviewModal, { IPreviewModal } from '.';
import { ignoreMockEditorError } from '../../../../testUtil/common';

const defaultProps: IPreviewModal = {
  params: {
    data_permission_template_uid: '69',
    effective_time_day: 0,
    db_account: {
      username: 'username1',
      hostname: 'hostname1',
      password: 'password1'
    },
    permission_user_uid: '123',
    purpose: 'purpose1'
  },
  setParams: jest.fn(),
  onSuccess: jest.fn()
};

describe('PreviewModal', () => {
  let addAuthorizationSpy: jest.SpyInstance;
  let getDataPermissionsInDataPermissionTemplateSpy: jest.SpyInstance;
  ignoreMockEditorError();
  beforeEach(() => {
    addAuthorizationSpy = auth.addAuthorization();
    getDataPermissionsInDataPermissionTemplateSpy =
      auth.getStatementsByDataPermissionTemplate();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should match close modal when modal status is false', async () => {
    const { container } = superRender(
      <PreviewModal {...defaultProps} params={undefined} />
    );
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = superRender(<PreviewModal {...defaultProps} />);
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('账号创建预览');
    expect(baseElement).toMatchSnapshot();
  });
  it('should close modal when user click close button', async () => {
    const setParams = jest.fn();
    superRender(<PreviewModal {...defaultProps} setParams={setParams} />);
    await screen.findByText('账号创建预览');
    fireEvent.click(screen.getByText('关 闭'));
    expect(setParams).toBeCalledTimes(1);
  });

  it('should add authorization when user click submit button', async () => {
    const onSuccess = jest.fn();
    superRender(<PreviewModal {...defaultProps} onSuccess={onSuccess} />);
    await screen.findByText('账号创建预览');
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(addAuthorizationSpy).toBeCalledWith({
      authorization: defaultProps.params
    });
    expect(screen.getByText('关 闭').parentElement).toBeDisabled();
    expect(screen.getByText('提 交').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('关 闭').parentElement).not.toBeDisabled();
    expect(screen.getByText('提 交').parentElement).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(onSuccess).toBeCalledTimes(1);
  });
});
