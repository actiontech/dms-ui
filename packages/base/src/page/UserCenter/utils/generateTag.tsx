import { BasicTag } from '@actiontech/dms-kit';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
export default function generateTag(list: IUidWithName[]) {
  return list?.map((r) => <BasicTag key={r.uid}>{r.name}</BasicTag>);
}
