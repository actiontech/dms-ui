import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import renderRolesInfo from '../renderRolesInfo';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

describe('base/Member/Common/renderRolesInfo', () => {
  const mockData = [
    {
      op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
      range_uids: [
        { uid: '701', name: 'Range1' },
        { uid: '702', name: 'Range2' }
      ],
      role_uid: { uid: '5001', name: 'Role1' }
    }
  ];
  it('should match snapshot when ellipsis is falsy', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <>{renderRolesInfo(mockData, false)}</>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when ellipsis is truthy', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <>{renderRolesInfo(mockData, true)}</>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
