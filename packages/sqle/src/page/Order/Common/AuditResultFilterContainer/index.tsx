import { Space } from 'antd5';
import {
  AuditResultFilterContainerStyleWrapper,
  AuditResultFilterOptionsStyleWrapper
} from '../style';
import { AuditResultFilterContainerProps } from './index.type';
import classNames from 'classnames';
import AuditResultInfo from './AuditResultInfo';

const AuditResultFilterContainer = <T extends string>(
  props: AuditResultFilterContainerProps<T>
) => {
  const {
    filterOptions,
    score,
    passRate,
    instanceSchemaName,
    filterValue,
    filterValueChange,
    auditLevel,
    bordered = true
  } = props;

  return (
    <AuditResultFilterContainerStyleWrapper
      className={classNames({
        'audit-result-filter-container-borderless': !bordered
      })}
    >
      <Space className="audit-result-filter-options">
        {filterOptions.map((v) => (
          <AuditResultFilterOptionsStyleWrapper
            onClick={() => filterValueChange(v.value)}
            active={filterValue === v.value}
            key={v.value}
          >
            {/* <span className="num">{v.num}</span> */}
            <span className="text">{v.label}</span>
          </AuditResultFilterOptionsStyleWrapper>
        ))}
      </Space>

      <AuditResultInfo
        {...{
          score,
          passRate,
          instanceSchemaName,
          auditLevel,
          bordered: false
        }}
      />
    </AuditResultFilterContainerStyleWrapper>
  );
};

export default AuditResultFilterContainer;
