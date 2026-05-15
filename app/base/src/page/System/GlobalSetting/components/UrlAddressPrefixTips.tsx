import { useTranslation } from 'react-i18next';
import { ConfigItem } from '@actiontech/dms-kit';
import { EditInput, LabelContent } from '@actiontech/dms-kit';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/base/service/common';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/features';
export interface UrlAddressPrefixTipsProps {
  url: string | undefined;
  fieldVisible: boolean;
  showField: () => void;
  hideField: () => void;
  submitGlobalConfig: (
    value: string | number,
    fieldName: keyof IUpdateSystemVariablesReqV1
  ) => void;
}
const UrlAddressPrefixTips = ({
  url,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig
}: UrlAddressPrefixTipsProps) => {
  const { t } = useTranslation();
  const { checkActionPermission } = usePermission();
  return (
    <>
      <ConfigItem
        label={
          <LabelContent tips={`${t('dmsSystem.global.urlAddressPrefixTips')}`}>
            {t('dmsSystem.global.urlAddressPrefix')}
          </LabelContent>
        }
        descNode={!!url ? url : '-'}
        fieldVisible={fieldVisible}
        showField={showField}
        hideField={hideField}
        needEditButton={checkActionPermission(
          PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.URL_ADDRESS_PREFIX
        )}
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
