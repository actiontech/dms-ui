import { useTranslation } from 'react-i18next';

import { ConfigItem } from '@actiontech/shared';
import {
  EditInput,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export interface UrlAddressPrefixTipsProps {
  url: string | undefined;
  fieldVisible: boolean;
  showField: () => void;
  hideField: () => void;
  submitGlobalConfig: (
    value: string | number,
    fieldName: keyof IUpdateSystemVariablesReqV1
  ) => void;
  isAdmin: boolean;
}

const UrlAddressPrefixTips = ({
  url,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig,
  isAdmin
}: UrlAddressPrefixTipsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <ConfigItem
        label={
          <LabelContent
            tips={`${t('dmsSystem.global.urlAddressPrefixTips')}, ${t(
              'dmsSystem.global.urlAddressFormatTips'
            )} `}
          >
            {t('dmsSystem.global.urlAddressPrefix')}
          </LabelContent>
        }
        descNode={!!url ? url : '-'}
        fieldVisible={fieldVisible}
        showField={showField}
        hideField={hideField}
        needEditButton={isAdmin}
        inputNode={
          <EditInput
            fieldValue={url ?? ''}
            hideField={hideField}
            onSubmit={(value: string) => {
              submitGlobalConfig(value, 'url');
            }}
          />
        }
      />
    </>
  );
};

export default UrlAddressPrefixTips;
