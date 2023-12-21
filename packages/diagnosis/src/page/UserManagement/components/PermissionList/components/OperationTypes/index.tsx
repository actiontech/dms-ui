import React from 'react';
import { IOperationTypesProps } from './index.type';
import {
  OperationTypeItemStyleWrapper,
  OperationTypeStyleWrapper
} from './style';

export const ALL_Operation = 'ALL';

const OperationTypes: React.FC<IOperationTypesProps> = ({
  typeData,
  currentType,
  setOperationType
}) => {
  return (
    <OperationTypeStyleWrapper>
      <OperationTypeItemStyleWrapper
        onClick={() => {
          setOperationType(ALL_Operation);
        }}
        active={currentType === ALL_Operation}
      >
        {ALL_Operation}
      </OperationTypeItemStyleWrapper>
      {typeData.map((type) => (
        <OperationTypeItemStyleWrapper
          key={type}
          onClick={() => {
            setOperationType(type ?? '');
          }}
          active={type === currentType}
        >
          {type}
        </OperationTypeItemStyleWrapper>
      ))}
    </OperationTypeStyleWrapper>
  );
};

export default OperationTypes;
