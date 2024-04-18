import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../testUtils/customRender';
import configuration from '../../../../../../testUtils/mockApi/configuration';
import ConfirmationSettingForm from '../ConfirmationSettingForm';
import { Form } from 'antd';
import { act } from '@testing-library/react';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('test ConfirmationSettingForm.test', () => {
  let getWechatAuditConfigSpy: jest.SpyInstance;
  let getFeishuAuditConfigSpy: jest.SpyInstance;
  const setSubmitButtonDisabled = jest.fn();
  const setConfirmTypeTokens = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getWechatAuditConfigSpy = configuration.getWechatAuditConfiguration();
    getFeishuAuditConfigSpy = configuration.getFeishuAuditConfiguration();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const options = [
    {
      label: '企业微信',
      value: UpdateWorkflowScheduleReqV2NotifyTypeEnum.Wechat
    },
    {
      label: '飞书',
      value: UpdateWorkflowScheduleReqV2NotifyTypeEnum.Feishu
    }
  ];

  const customRender = (enable = true) => {
    return superRender(
      <Form>
        <ConfirmationSettingForm
          enable={enable}
          setSubmitButtonDisabled={setSubmitButtonDisabled}
          setConfirmTypeTokens={setConfirmTypeTokens}
          confirmTypeTokens={options}
        />
      </Form>
    );
  };

  it('render snapshot when enable is equal false', () => {
    const { container } = customRender(false);

    expect(getWechatAuditConfigSpy).not.toHaveBeenCalled();
    expect(getFeishuAuditConfigSpy).not.toHaveBeenCalled();
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();
  });

  it('render snapshot when enable is equal true and open the config', async () => {
    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_wechat_notification_enabled: true
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: true
        }
      })
    );
    const { container } = customRender();

    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setConfirmTypeTokens).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).toHaveBeenCalledWith(options);
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();
  });

  it('render snapshot when enable is equal true and open the feishu config', async () => {
    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_wechat_notification_enabled: false
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: true
        }
      })
    );
    const { container } = customRender();

    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setConfirmTypeTokens).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).toHaveBeenCalledWith([options[1]]);
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();
  });

  it('render snapshot when enable is equal true and open the wechat config', async () => {
    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_wechat_notification_enabled: true
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: false
        }
      })
    );
    const { container } = customRender();

    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setConfirmTypeTokens).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).toHaveBeenCalledWith([options[0]]);
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();
  });

  it('render snapshot when enable is equal true and close the config', async () => {
    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_wechat_notification_enabled: false
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: false
        }
      })
    );
    const { container } = customRender();

    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setConfirmTypeTokens).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).toHaveBeenCalledWith([]);
    expect(setSubmitButtonDisabled).toHaveBeenCalledTimes(1);
    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(true);
  });

  it('render snapshot when enable is equal true and request throw catch', async () => {
    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpyErrorResponse({
        data: {
          is_wechat_notification_enabled: false
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: false
        }
      })
    );
    const { container } = customRender();

    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setConfirmTypeTokens).not.toHaveBeenCalled();
    expect(setSubmitButtonDisabled).toHaveBeenCalledTimes(1);
    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(true);
  });
});
