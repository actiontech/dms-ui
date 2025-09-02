import DatabaseRoleModal from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { DatabaseRoleModalStatus } from '../../../../store/databaseRole';
import { ModalName } from '../../../../data/enum';

describe('page/DatabaseRole/Modal/DatabaseRoleModal', () => {
  const customRender = () => {
    return superRender(<DatabaseRoleModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseRoleModalStatus, {
            [ModalName.DatabaseRoleDetailModal]: true
          });
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });
});
