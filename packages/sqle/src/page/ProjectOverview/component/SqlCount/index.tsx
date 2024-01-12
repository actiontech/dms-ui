import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../components/CardWrapper';
import ChartContTitle from '../../../../page/ReportStatistics/EEIndex/component/base/ChartContTitle';

import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

import { RingProgress, RingProgressConfig } from '@ant-design/plots';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { PopoverTooltipStyleWrapper } from '../../../../components/ChartCom/ChartTooltip/style';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';

const SqlCount = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();

  const { projectName } = useCurrentProject();

  const [data, setData] = useState<number>(0);
  const [totalData, setTotalData] = useState({
    risk_sql_count: '0',
    total_sql_count: '0'
  });
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.statisticsAuditedSQLV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data?.risk_rate ?? 0);
        setTotalData({
          risk_sql_count: res.data.data?.risk_sql_count
            ? formatParamsBySeparator(res.data.data?.risk_sql_count)
            : '0',
          total_sql_count: res.data.data?.total_sql_count
            ? formatParamsBySeparator(res.data.data?.total_sql_count)
            : '0'
        });
      }
    }
  );

  const { sharedTheme, sqleTheme } = useThemeStyleData();
  const renderToolTip = (childrenNode: string) => {
    return (
      <PopoverTooltipStyleWrapper
        arrow={false}
        trigger="click"
        overlayStyle={{
          width: '190px',
          paddingTop: 0
        }}
        content={
          <ChartTooltip
            sharedTheme={sharedTheme}
            titleData={{
              dotColor: sqleTheme.projectOverview.SqlCount.baseColor,
              text: t('projectManage.projectOverview.sqlCount.title')
            }}
            listData={[
              {
                label: t(
                  'projectManage.projectOverview.sqlCount.riskSQLNumber'
                ),
                value: totalData.risk_sql_count
              },
              {
                label: t('projectManage.projectOverview.sqlCount.SQLCount'),
                value: totalData.total_sql_count
              }
            ]}
          />
        }
      >
        {childrenNode}
      </PopoverTooltipStyleWrapper>
    );
  };

  const config: RingProgressConfig = {
    autoFit: true,
    appendPadding: [16, 0, 8, 0],
    percent: data,
    color: [
      sqleTheme.projectOverview.SqlCount.baseColor,
      sqleTheme.projectOverview.SqlCount.grayColor
    ],
    radius: 0.9,
    innerRadius: 0.75,
    statistic: {
      title: {
        style: {
          color: sharedTheme.uiToken.colorTextBase,
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          textAlign: 'center'
        },
        customHtml: (container, view, datum) => {
          return datum?.percent ? `${datum.percent}%` : '0';
        }
      },
      content: {
        style: {
          fontSize: '12px',
          fontWeight: 300,
          color: sharedTheme.uiToken.colorTextTertiary,
          lineHeight: '20px'
        },
        content: t('projectManage.projectOverview.sqlCount.riskRate')
      }
    }
  };

  return (
    <CardWrapper title={t('projectManage.projectOverview.sqlCount.title')}>
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={data}
        emptyCont={t('common.tip.no_data')}
        onRefresh={() => {
          getApiData();
        }}
      >
        <ChartContTitle
          clearMainTextMargin
          mainText={renderToolTip(`${totalData.risk_sql_count} `)}
          mainSubText={renderToolTip(`/ ${totalData.total_sql_count}`)}
          noteText={t('projectManage.projectOverview.sqlCount.riskSQL')}
        />
        <section style={{ height: 200 }}>
          <RingProgress {...config} theme={currentTheme} />
        </section>
      </ChartWrapper>
    </CardWrapper>
  );
};

export default SqlCount;
