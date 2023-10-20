import { useBoolean, useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { Spin } from 'antd5';
import { ConfigItem } from '@actiontech/shared';
import {
  EditInput,
  ImageUploader,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { IPersonalizationParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import {
  DMS_DEFAULT_WEB_LOGO_URL,
  DMS_DEFAULT_WEB_TITLE
} from '@actiontech/shared/lib/data/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useMemo } from 'react';
import { ConfigFieldMapMeta } from '@actiontech/shared/lib/components/ConfigItem/index.type';
import useHideConfigInputNode from '@actiontech/shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';
import useSystemConfig from '../../../hooks/useSystemConfig.tsx';

const PersonalizeSetting: React.FC = () => {
  const { t } = useTranslation();

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
    dms.GetBasicInfo().then((res) => {
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
    dms
      .Personalization(
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
    <section className="system-form-wrapper">
      <div className="config-title-wrapper has-border">
        {t('dmsSystem.tabPaneTitle.personalize')}
      </div>
      <Spin spinning={loading}>
        <ConfigItem
          label={
            <LabelContent>{t('dmsSystem.personalize.title')}</LabelContent>
          }
          descNode={webTitleInPage}
          fieldVisible={titleFieldVisible}
          showField={showTitleField}
          hideField={hideTitleField}
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
    </section>
  );
};

export default PersonalizeSetting;
