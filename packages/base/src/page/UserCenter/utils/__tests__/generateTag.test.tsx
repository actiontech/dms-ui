import generateTag from '../generateTag';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';

describe('test generateTag', () => {
  test('should match snapshot for generateTag method', () => {
    const list: IUidWithName[] = [
      {
        uid: '1001',
        name: 'test1'
      },
      {
        uid: '1002',
        name: 'test2'
      }
    ];
    expect(generateTag(list)).toMatchSnapshot();
  });
});
