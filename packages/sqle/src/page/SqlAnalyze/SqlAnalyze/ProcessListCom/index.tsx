import { BasicTable, EmptyBox, SQLRenderer } from '@actiontech/shared';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';

import { ProcessListComStyleWrapper } from './style';

const ProcessListCom = () => {
  return (
    <ProcessListComStyleWrapper>
      <h3 className="header-title">列信息</h3>
      <section className="basic-cont-wrapper">
        <EmptyBox if={true} defaultNode={<BasicEmpty />}>
          <BasicTable
            columns={[{ dataIndex: 'index', key: 'index' }]}
            pagination={false}
          />
        </EmptyBox>
      </section>
      <h3 className="header-title">索引信息</h3>
      <section className="basic-cont-wrapper">
        <EmptyBox if={true} defaultNode={<BasicEmpty />}>
          <BasicTable
            columns={[{ dataIndex: 'index', key: 'index' }]}
            pagination={false}
          />
        </EmptyBox>
      </section>
      <h3 className="header-title">SQL语句</h3>
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
