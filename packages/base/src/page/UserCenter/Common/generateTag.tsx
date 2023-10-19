import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { Tag } from 'antd5';

export default function generateTag(list: IUidWithName[]) {
  return list?.map((r) => <Tag key={r.uid}>{r.name}</Tag>);
}
