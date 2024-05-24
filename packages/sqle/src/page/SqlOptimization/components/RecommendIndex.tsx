import { SqlOptimizationSqlBlockStyleWrapper } from '../style';
import { EmptyBox, SQLRenderer } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import { IconLink } from '../../../icon/sqlOptimization';
import { Space, Typography } from 'antd';

const RecommendIndex: React.FC<{ recommendations?: string[] }> = ({
  recommendations
}) => {
  const { t } = useTranslation();

  return (
    <SqlOptimizationSqlBlockStyleWrapper>
      <EmptyBox
        if={recommendations && !!recommendations.length}
        defaultNode={
          <Space align="center">
            <Typography.Text>
              {t('sqlOptimization.overview.indexTips')}
            </Typography.Text>
            <Icon component={IconLink} />
          </Space>
        }
      >
        {recommendations?.map((item, index) => (
          <SQLRenderer.Snippet showCopyIcon sql={item} key={index} rows={1} />
        ))}
      </EmptyBox>
    </SqlOptimizationSqlBlockStyleWrapper>
  );
};

export default RecommendIndex;
