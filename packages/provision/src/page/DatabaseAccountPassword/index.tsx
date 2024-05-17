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
import useModalStatus from '../../hooks/useModalStatus';
import { PasswordSecurityPolicyModalStatus } from '../../store/databaseAccountPassword';
import { ModalName } from '../../data/enum';

const DatabaseAccountPassword = () => {
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
        label: t('passwordSecurityPolicy.advent.title'),
        content: null
      },
      {
        value: PasswordManagementTypeEnum.policy,
        label: t('passwordSecurityPolicy.policy.title'),
        content: <PolicyList />,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={onCreatePolicy}
          >
            {t('passwordSecurityPolicy.policy.create')}
          </BasicButton>
        )
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title={t('passwordSecurityPolicy.title')}
        extra={renderExtraButton()}
      />
      <BasicSegmentedPage {...otherProps} />
      <PasswordSecurityPolicyModal />
    </>
  );
};

export default DatabaseAccountPassword;
