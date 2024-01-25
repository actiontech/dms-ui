import { useTranslation } from 'react-i18next';

import { ConfigItem } from '@actiontech/shared';
import {
  EditInput,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';

export interface UrlAddressPrefixTipsProps {
  url: any;
  fieldVisible: any;
  showField: any;
  hideField: any;
  submitGlobalConfig: any;
}

const UrlAddressPrefixTips = ({
  url,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig
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
