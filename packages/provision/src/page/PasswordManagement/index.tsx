import { PageHeader, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  BasicSegmentedPage,
  useSegmentedPageParams
} from '@actiontech/shared/lib/components/BasicSegmentedPage';
import { PasswordManagementTypeEnum } from './index.type';
import { useEffect } from 'react';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import PolicyList from './PolicyList';
import PasswordSecurityPolicyModal from './Modal';
import useModalStatus from '~/hooks/useModalStatus';
import { PasswordSecurityPolicyModalStatus } from '~/store/passwordManagement';
import { ModalName } from '~/data/enum';
import ExpirationAccountList from './ExpirationAccount';

const PasswordManagement = () => {
  const { t } = useTranslation();

  const { toggleModal } = useModalStatus(PasswordSecurityPolicyModalStatus);

  const { updateSegmentedPageData, renderExtraButton, ...otherProps } =
    useSegmentedPageParams<PasswordManagementTypeEnum>();

  useEffect(() => {
    const onCreatePolicy = () => {
      toggleModal(ModalName.CreatePasswordSecurityPolicyModal, true);
    };

    updateSegmentedPageData([
      {
        value: PasswordManagementTypeEnum.advent,
        label: t('password.advent.title'),
        content: <ExpirationAccountList />
      },
      {
        value: PasswordManagementTypeEnum.policy,
        label: t('password.policy.title'),
        content: <PolicyList />,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={onCreatePolicy}
          >
            {t('password.policy.create')}
          </BasicButton>
        )
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader title={t('password.title')} extra={renderExtraButton()} />
      <BasicSegmentedPage {...otherProps} />
      <PasswordSecurityPolicyModal />
    </>
  );
};

export default PasswordManagement;
