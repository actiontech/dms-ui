import { BasicEmpty, BasicTable, EmptyBox } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ProcessListComStyleWrapper } from './style';

const ProcessListCom = () => {
  const { t } = useTranslation();
  return (
    <ProcessListComStyleWrapper>
      <h3 className="header-title">{t('sqlAnalyze.columnInfo')}</h3>
      <section className="basic-cont-wrapper">
        <EmptyBox if={true} defaultNode={<BasicEmpty />}>
          <BasicTable
            columns={[
              {
                dataIndex: 'index',
                key: 'index'
              }
            ]}
            pagination={false}
          />
        </EmptyBox>
      </section>
      <h3 className="header-title">{t('sqlAnalyze.indexInfo')}</h3>
      <section className="basic-cont-wrapper">
        <EmptyBox if={true} defaultNode={<BasicEmpty />}>
          <BasicTable
            columns={[
              {
                dataIndex: 'index',
                key: 'index'
              }
            ]}
            pagination={false}
          />
        </EmptyBox>
      </section>
      <h3 className="header-title">{t('sqlAnalyze.sqlStatement')}</h3>
      <section className="basic-cont-wrapper sql-cont">
        <EmptyBox if={true} defaultNode={<BasicEmpty />}>
          <div className="pre-warp-break-all">
            <SQLRenderer.Snippet
              showCopyIcon
              sql={`SELECT DISTINCT db,time,info
FROM information_schema.processlist
WHERE ID != connection_id() AND info != '' AND db NOT IN ('information_schema','performance_schema','mysql','sys')`}
            />
          </div>
        </EmptyBox>
      </section>
    </ProcessListComStyleWrapper>
  );
};

export default ProcessListCom;
