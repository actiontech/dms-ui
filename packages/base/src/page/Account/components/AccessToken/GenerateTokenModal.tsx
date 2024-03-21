import { BasicButton, BasicDrawer, BasicInputNumber } from '@actiontech/shared';
import { GenerateTokenFields, GenerateTokenModalProps } from '../../index.type';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const GenerateTokenModal: React.FC<GenerateTokenModalProps> = ({
  open,
  onClose,
  refresh
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<GenerateTokenFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    dms
      .GenAccessToken({
        expiration_days: values.expirationDays.toString()
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          internalCloseHandle();
          refresh();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const internalCloseHandle = () => {
    form.resetFields();
    onClose();
  };

  return (
    <BasicDrawer
      open={open}
      onClose={internalCloseHandle}
      title={t('dmsAccount.accessToken.generateToken.title')}
      footer={
        <Space>
          <BasicButton onClick={internalCloseHandle} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={onSubmit}
            loading={submitLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <FormItemLabel
          name="expirationDays"
          className="has-label-tip"
          label={
            <div className="label-cont-custom">
              <div>{t('dmsAccount.accessToken.generateToken.expiration')}</div>
              <div className="tip-content-box">
                {t('dmsAccount.accessToken.generateToken.generateTips')}
              </div>
            </div>
          }
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.input', {
                name: t(
                  'dmsAccount.accessToken.generateToken.expirationPlaceholder'
                )
              })
            }
          ]}
        >
          <BasicInputNumber
            formatter={(value) => {
              if (!value) {
                return '';
              }

              return `${Math.floor(value as number)}`;
            }}
            min={1}
            placeholder={t('common.form.placeholder.input', {
              name: t(
                'dmsAccount.accessToken.generateToken.expirationPlaceholder'
              )
            })}
          />
        </FormItemLabel>
      </Form>
    </BasicDrawer>
  );
};

export default GenerateTokenModal;
