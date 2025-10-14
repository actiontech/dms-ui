import React, { useMemo } from 'react';
import { BasicInfoListStyleWrapper } from './style';
import { Card, Row, Col } from 'antd';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import { BasicInfoListProps } from './BasicInfoList.types';

const BasicInfoList: React.FC<BasicInfoListProps> = (props) => {
  const { data, columnNumber = 3, errorInfo, errorTitle, loading } = props;

  const gridStyle = useMemo(
    () => ({ width: `${100 / columnNumber}%` }),
    [columnNumber]
  );

  const lastGridStyle = useMemo(() => {
    const remainderColumns = data.length % columnNumber;
    if (remainderColumns === 0) {
      return gridStyle;
    }
    return {
      width: `${(columnNumber + 1 - remainderColumns) * (100 / columnNumber)}%`
    };
  }, [columnNumber, data, gridStyle]);

  const renderCardInfo = () => {
    return data.map((item, index) => (
      <Card.Grid
        key={
          props.title
            ? `${props.title}-${index}`
            : `card-grid-${index}-${Math.round(Math.random() * 1000)}`
        }
        style={index === data.length - 1 ? lastGridStyle : gridStyle}
        className="info-item-wrapper"
        hoverable={false}
      >
        <Row className="info-item-row">
          <Col className="info-item-title">{item.key}</Col>
          <Col className="info-item-value">{item.value}</Col>
        </Row>
      </Card.Grid>
    ));
  };

  return (
    <>
      <BasicInfoListStyleWrapper title={props.title}>
        {loading || data.length === 0 || errorInfo ? (
          <BasicEmpty
            loading={loading}
            dataLength={data.length}
            errorInfo={errorInfo}
            errorTitle={errorTitle}
          />
        ) : (
          renderCardInfo()
        )}
      </BasicInfoListStyleWrapper>
    </>
  );
};

export default BasicInfoList;
