import React from 'react';
import Select from 'antd/es/select';
import { HeaderExtraStyleWrapper } from './style';

// 该值取自 /packages/**/.dumirc.ts的define字段
declare const VERSION: string;

const HeaderExtra: React.FC<{ pkg?: 'dms-kit' | 'icons' }> = ({
  pkg = 'dms-kit'
}) => {
  const curVersion = Number(VERSION.split('.')[0]);
  const historyVersions = new Array(curVersion)
    .fill(0)
    .map((_, idx) => `v${idx}`)
    .reverse();
  const options = [VERSION, ...historyVersions].map((item) => ({
    value: item,
    label: item
  }));

  const handleVersionChange = (version: string) => {
    window.location.href = `/doc/${pkg}-${version}`;
  };

  return (
    <HeaderExtraStyleWrapper>
      <Select
        value={VERSION}
        options={options}
        onChange={handleVersionChange}
        style={{ borderRadius: 10 }}
      />
    </HeaderExtraStyleWrapper>
  );
};

export default HeaderExtra;
