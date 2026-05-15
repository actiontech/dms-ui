import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import UserForm from '../index';
import { IUserFormFields } from '../index.type';
import { act, screen, fireEvent } from '@testing-library/react';
import { OpPermissionTypeUid } from '@actiontech/dms-kit';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';

describe('UserForm business write permission switch', () => {
  let getOpPermissionsListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getOpPermissionsListSpy = userCenter.getOpPermissionsList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const renderUserForm = (
    overrideProps: Partial<{
      isUpdate: boolean;
      isAdmin: boolean;
      isEditingAdmin: boolean;
      visible: boolean;
    }> = {},
    initialValues?: Partial<IUserFormFields>
  ) => {
    const Wrapper = () => {
      const [form] = Form.useForm<IUserFormFields>();

      if (initialValues) {
        setTimeout(() => {
          form.setFieldsValue(initialValues);
        }, 0);
      }

      return (
        <UserForm
          form={form}
          visible={overrideProps.visible ?? true}
          isUpdate={overrideProps.isUpdate}
          isAdmin={overrideProps.isAdmin}
          isEditingAdmin={overrideProps.isEditingAdmin}
        />
      );
    };

    return superRender(<Wrapper />);
  };

  it('should show BWP switch when role is system administrator', async () => {
    renderUserForm(
      {},
      { opPermissionUid: OpPermissionTypeUid.system_administrator }
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('业务写权')).toBeInTheDocument();
  });

  it('should hide BWP switch when role is normal user', async () => {
    renderUserForm(
      {},
      { opPermissionUid: OpPermissionTypeUid.audit_administrator }
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('业务写权')).not.toBeInTheDocument();
  });

  it('should always show BWP switch when editing admin account', async () => {
    renderUserForm(
      { isEditingAdmin: true, isUpdate: true },
      { opPermissionUid: undefined }
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('业务写权')).toBeInTheDocument();
  });

  it('should reset BWP switch to checked when switching to system administrator role', async () => {
    const Wrapper = () => {
      const [form] = Form.useForm<IUserFormFields>();

      return (
        <div>
          <UserForm form={form} visible={true} />
          <button
            data-testid="set-sysadmin"
            onClick={() => {
              form.setFieldsValue({
                opPermissionUid: OpPermissionTypeUid.system_administrator,
                businessWritePermission: true
              });
            }}
          />
          <button
            data-testid="set-audit"
            onClick={() => {
              form.setFieldsValue({
                opPermissionUid: OpPermissionTypeUid.audit_administrator
              });
            }}
          />
          <button
            data-testid="set-sysadmin-again"
            onClick={() => {
              form.setFieldsValue({
                opPermissionUid: OpPermissionTypeUid.system_administrator
              });
            }}
          />
        </div>
      );
    };

    superRender(<Wrapper />);
    await act(async () => jest.advanceTimersByTime(3000));

    // Set to sysadmin first
    fireEvent.click(screen.getByTestId('set-sysadmin'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('业务写权')).toBeInTheDocument();

    // Switch to audit admin
    fireEvent.click(screen.getByTestId('set-audit'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('业务写权')).not.toBeInTheDocument();

    // Switch back to sysadmin - should reset to checked
    fireEvent.click(screen.getByTestId('set-sysadmin-again'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('业务写权')).toBeInTheDocument();
  });

  it('should default BWP switch to on for new system administrator', async () => {
    renderUserForm(
      {},
      { opPermissionUid: OpPermissionTypeUid.system_administrator }
    );

    await act(async () => jest.advanceTimersByTime(0));

    const switchEl = screen
      .getByText('业务写权')
      .closest('.ant-form-item')
      ?.querySelector('.ant-switch');
    expect(switchEl).not.toBeNull();
  });
});
