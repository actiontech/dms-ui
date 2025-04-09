import { useTranslation } from 'react-i18next';
import { Form, Radio } from 'antd';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import {
  BasicInput,
  BasicToolTip,
  EmptyBox,
  ReminderInformation,
  TypedLink,
  BasicButton,
  BasicSelect
} from '@actiontech/shared';
import { GitProtocolType, RepositoryConfigProps } from './index.type';
import useRepositoryConnection from './hooks/useRepositoryConnection';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { SQLInfoFormFields } from '../../../SQLInfoForm/index.type';

const RepositoryConfig: React.FC<RepositoryConfigProps> = ({
  submitLoading
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SQLInfoFormFields>();
  const protocol = Form.useWatch('gitProtocol', form);

  const {
    branchOptions,
    isConnectable,
    verifyConnection,
    verifyConnectionLoading,
    connectionInfoHide,
    connectionErrorMsg,
    initConnectionState
  } = useRepositoryConnection();

  const handleChangeProtocol = () => {
    form.resetFields([
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword',
      'gitBranch'
    ]);
    initConnectionState();
  };

  const protocolOptions = [
    {
      label: 'HTTP/HTTPS',
      value: GitProtocolType.HTTP,
      description: t('sqlAudit.create.sqlInfo.uploadLabelEnum.protocolHttpDesc')
    },
    {
      label: 'Git',
      value: GitProtocolType.GIT,
      description: t('sqlAudit.create.sqlInfo.uploadLabelEnum.protocolGitDesc')
    },
    {
      label: 'SSH',
      value: GitProtocolType.SSH,
      description: (
        <>
          <span>
            {t('sqlAudit.create.sqlInfo.uploadLabelEnum.sshAuthTips')}
          </span>
          <PermissionControl permission={PERMISSIONS.PAGES.BASE.SYSTEM_SETTING}>
            <TypedLink
              target="_blank"
              to={ROUTE_PATHS.BASE.SYSTEM.index}
              queries={{ active_tab: 'git_ssh_config' }}
            >
              {t('sqlAudit.create.sqlInfo.uploadLabelEnum.configureSsh')}
            </TypedLink>
          </PermissionControl>
        </>
      )
    }
  ];

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitProtocol')}
        name="gitProtocol"
        initialValue={GitProtocolType.HTTP}
        rules={[{ required: true }]}
        {...formItemLayout.spaceBetween}
      >
        <Radio.Group
          disabled={submitLoading || verifyConnectionLoading}
          onChange={handleChangeProtocol}
        >
          {protocolOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              <BasicToolTip title={option.description}>
                {option.label}
              </BasicToolTip>
            </Radio>
          ))}
        </Radio.Group>
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        name="gitHttpUrl"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')
            })
          }
        ]}
        {...formItemLayout.fullLine}
        label={
          <BasicToolTip
            suffixIcon
            title={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrlTips')}
          >
            {t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')}
          </BasicToolTip>
        }
      >
        <BasicInput
          disabled={submitLoading}
          placeholder={t('common.form.placeholder.input', {
            name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')
          })}
        />
      </FormItemLabel>

      <EmptyBox if={protocol === GitProtocolType.HTTP}>
        <FormItemLabel
          name="gitUserName"
          label={t('common.username')}
          {...formItemLayout.spaceBetween}
        >
          <BasicInput
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.username')
            })}
          />
        </FormItemLabel>
        <FormItemLabel
          name="gitUserPassword"
          label={t('common.password')}
          {...formItemLayout.spaceBetween}
        >
          <BasicInput.Password
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.password')
            })}
          />
        </FormItemLabel>
      </EmptyBox>

      <FormItemNoLabel {...formItemLayout.spaceBetween}>
        <BasicButton
          onClick={verifyConnection}
          loading={verifyConnectionLoading}
        >
          {t('sqlAudit.create.sqlInfo.uploadLabelEnum.verifyConnection')}
        </BasicButton>
        <EmptyBox if={!connectionInfoHide}>
          {!verifyConnectionLoading && isConnectable && (
            <ReminderInformation
              status="success"
              message={t(
                'sqlAudit.create.sqlInfo.uploadLabelEnum.connectSuccess'
              )}
            />
          )}
          {!verifyConnectionLoading && !isConnectable && (
            <ReminderInformation
              status="error"
              message={connectionErrorMsg ?? t('common.unknownError')}
            />
          )}
        </EmptyBox>
      </FormItemNoLabel>

      <FormItemLabel
        className="has-required-style"
        name="gitBranch"
        label={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')}
        {...formItemLayout.spaceBetween}
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')
            })
          }
        ]}
      >
        <BasicSelect
          disabled={submitLoading || !isConnectable}
          placeholder={
            !isConnectable
              ? t(
                  'sqlAudit.create.sqlInfo.uploadLabelEnum.pleaseVerifyConnection'
                )
              : t('common.form.placeholder.select', {
                  name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')
                })
          }
          options={branchOptions}
          showSearch
          filterOption={filterOptionByLabel}
        />
      </FormItemLabel>
    </>
  );
};

export default RepositoryConfig;
