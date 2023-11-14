import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag } from '@actiontech/shared';

export default function generateTag(list: IUidWithName[]) {
  return list?.map((r) => <BasicTag key={r.uid}>{r.name}</BasicTag>);
}
