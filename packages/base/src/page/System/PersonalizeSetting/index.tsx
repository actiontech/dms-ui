import { useBoolean, useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Spin } from 'antd';
import { ConfigItem } from '@actiontech/shared';
import {
  ConfigFieldMapMeta,
  EditInput,
  ImageUploader,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import SystemBasicTitle from '../components/BasicTitle';

import {
  DMS_DEFAULT_WEB_LOGO_URL,
  DMS_DEFAULT_WEB_TITLE
} from '@actiontech/shared/lib/data/common';
import useHideConfigInputNode from '@actiontech/shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';
import useSystemConfig from '../../../hooks/useSystemConfig';
import BasicInfo from '@actiontech/shared/lib/api/base/service/BasicInfo';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IPersonalizationParams } from '@actiontech/shared/lib/api/base/service/BasicInfo/index.d';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/global';

const PersonalizeSetting: React.FC = () => {
  const { t } = useTranslation();

  const { checkActionPermission } = usePermission();
  const [
    titleFieldVisible,
    { setTrue: showTitleField, setFalse: hideTitleField }
  ] = useBoolean(false);

  const fieldMetaMap = new Map<
    keyof IPersonalizationParams,
    ConfigFieldMapMeta
  >([
    ['title', { hideField: hideTitleField }],
    ['file', {}]
  ]);

  useHideConfigInputNode(titleFieldVisible, hideTitleField);

  const { syncWebTitleAndLogo } = useSystemConfig();

  const {
    data: basicInfo,
    loading,
    refresh
  } = useRequest(() =>
    BasicInfo.GetBasicInfo().then((res) => {
      const basicInfoRes = res.data.data;
      if (basicInfoRes) syncWebTitleAndLogo(basicInfoRes);

      return basicInfoRes ?? {};
    })
  );

  const webTitleInPage = useMemo(() => {
    return !!basicInfo?.title ? basicInfo.title : DMS_DEFAULT_WEB_TITLE;
  }, [basicInfo]);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submitPersonalize = (
    value: string | File,
    fieldName: keyof IPersonalizationParams
  ) => {
    startSubmit();
    BasicInfo.Personalization(
      {
        [fieldName]: value
      },
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    )
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          fieldMetaMap.get(fieldName)?.hideField?.();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.personalize')}>
      <Spin spinning={loading}>
        <ConfigItem
          label={
            <LabelContent>{t('dmsSystem.personalize.title')}</LabelContent>
          }
          descNode={webTitleInPage}
          fieldVisible={titleFieldVisible}
          showField={showTitleField}
          hideField={hideTitleField}
          needEditButton={checkActionPermission(
            PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING
              .PERSONALIZE_TITLE
          )}
          inputNode={
            <EditInput
              submitLoading={submitLoading}
              fieldValue={webTitleInPage}
              hideField={hideTitleField}
              onSubmit={(value: string) => {
                submitPersonalize(value, 'title');
              }}
            />
          }
        />
        <ConfigItem
          label={
            <LabelContent tips={t('dmsSystem.personalize.uploadTips')}>
              {t('dmsSystem.personalize.logo')}
            </LabelContent>
          }
          inputNode={
            <ImageUploader
              disabled={
                !checkActionPermission(
                  PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING
                    .PERSONALIZE_LOGO
                )
              }
              submitLoading={submitLoading}
              onSubmit={(option) => {
                submitPersonalize(option.file as File, 'file');
              }}
              url={
                !!basicInfo?.logo_url
                  ? basicInfo?.logo_url
                  : DMS_DEFAULT_WEB_LOGO_URL
              }
            />
          }
        />
      </Spin>
    </SystemBasicTitle>
  );
};

export default PersonalizeSetting;
