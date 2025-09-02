import {
  PageHeader,
  BasicButton,
  SegmentedTabs,
  EmptyBox
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { PasswordManagementTypeEnum } from './index.type';
import { useState } from 'react';
import PolicyList from './PolicyList';
import PasswordSecurityPolicyModal from './Modal';
import useModalStatus from '../../hooks/useModalStatus';
import { PasswordSecurityPolicyModalStatus } from '../../store/databaseAccountPassword';
import { ModalName } from '../../data/enum';
import ExpirationAccountList from './ExpirationAccount';
import { PlusOutlined } from '@actiontech/icons';

const DatabaseAccountPassword = () => {
  const { t } = useTranslation();

  const { toggleModal } = useModalStatus(PasswordSecurityPolicyModalStatus);

  const [activeTab, setActiveTab] = useState(PasswordManagementTypeEnum.advent);

  const onCreatePolicy = () => {
    toggleModal(ModalName.CreatePasswordSecurityPolicyModal, true);
  };

  return (
    <>
      <PageHeader
        title={t('passwordSecurityPolicy.title')}
        extra={
          <EmptyBox if={activeTab === PasswordManagementTypeEnum.policy}>
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined color="currentColor" width={12} height={12} />
              }
              onClick={onCreatePolicy}
            >
              {t('passwordSecurityPolicy.policy.create')}
            </BasicButton>
          </EmptyBox>
        }
      />

      <SegmentedTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            value: PasswordManagementTypeEnum.advent,
            label: t('passwordSecurityPolicy.advent.title'),
            children: <ExpirationAccountList />,
            destroyInactivePane: true
          },
          {
            value: PasswordManagementTypeEnum.policy,
            label: t('passwordSecurityPolicy.policy.title'),
            children: <PolicyList />,
            destroyInactivePane: true
          }
        ]}
      />
      <PasswordSecurityPolicyModal />
    </>
  );
};

export default DatabaseAccountPassword;
