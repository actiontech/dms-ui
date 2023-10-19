import { AxiosResponse } from 'axios';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import ChartContTitle from '../../base/ChartContTitle';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import LicenseColumn from './licenseColumn';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { IGetLicenseUsageV1Return } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { ILicenseUsageItem } from '@actiontech/shared/lib/api/sqle/service/common';
import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';

type typeDctItem = {
  type: string;
  value: number | string;
  desc: string;
  limit: number;
};

/**
 * todo
  接口没调通: 接口数据类型中没有
  resource_type_desc 太长了
  柱形数量太多的时候，柱形下面的类型描述 会间隔隐藏
 */
const LicenseStatistics = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [focusData, setFocusData] = useState<typeDctItem>({
    type: 'User',
    value: 0,
    desc: t('reportStatistics.licenseStatistics.charts.user'),
    limit: 0
  });
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleChartEleCallBack = (sourceData: any) => {
    const { data } = sourceData;
    if (data) {
      setFocusData(data);
    }
  };

  const [data, setData] = useState<typeDctItem[] | []>([]);

  const onSuccess = (res: AxiosResponse<IGetLicenseUsageV1Return>) => {
    // ??? todo: 暂时注释 有效期
    // const validityData: typeDctItem = {
    //   type: t('reportStatistics.licenseStatistics.charts.validity'),
    //   value: 0,
    //   desc: t('reportStatistics.licenseStatistics.charts.validity'),
    //   limit: 0
    // };
    const users_usage = res.data.data?.users_usage ?? {};
    const userData: typeDctItem = {
      type: 'User',
      value: users_usage?.used ?? 0,
      desc:
        users_usage?.resource_type_desc ??
        t('reportStatistics.licenseStatistics.charts.user'),
      limit: users_usage?.limit ?? 0
    };
    setFocusData(userData);
    const allData = [];
    allData.push(...[userData]);
    const otherData = (res.data.data?.instances_usage ?? []).map(
      (item: ILicenseUsageItem) => {
        return {
          type: item?.resource_type ?? '',
          desc: item?.resource_type_desc ?? '',
          value: item?.used ?? 0,
          limit: item?.limit ?? 0
        };
      }
    );
    setData(allData.concat(otherData));
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => statistic.getLicenseUsageV1(),
    { onSuccess }
  );

  return (
    <ChartWrapper
      loading={loading}
      errorInfo={errorMessage}
      dataLength={data.length}
      emptyCont={t('reportStatistics.licenseStatistics.emptyText')}
      onRefresh={getApiData}
    >
      <ChartContTitle
        color={
          sqleTheme.reportStatistics.LicenseStatistics.ChartContTitle.lineColor
        }
        mainText={
          focusData?.value ? formatParamsBySeparator(focusData.value) : 0
        }
        mainSubText={`${
          !focusData?.limit
            ? ''
            : `/ ${formatParamsBySeparator(focusData.limit)}`
        }`}
        noteText={`${
          focusData?.desc
            ? `${focusData?.desc} ${t(
                'reportStatistics.licenseStatistics.charts.instanceNum'
              )}`
            : '-'
        }`}
      />
      <section style={{ height: 190, marginTop: '40px' }} ref={chartWrapperRef}>
        <LicenseColumn
          data={data}
          onReady={(plot: any) => {
            plot.on('element:click', function (event: any) {
              const { data: item } = event;
              handleChartEleCallBack(item);
            });
          }}
        />
      </section>
    </ChartWrapper>
  );
};

export default LicenseStatistics;
