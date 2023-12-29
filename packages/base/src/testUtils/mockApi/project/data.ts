import { IListProject } from '@actiontech/shared/lib/api/base/service/common';

export const mockProjectList: IListProject[] = [
  {
    uid: '100121',
    name: 'test_project_1',
    desc: 'test project 1 desc',
    archived: true,
    create_time: '2023-06-01T10:00:00.000Z',
    create_user: {
      uid: '700101',
      name: 'admin'
    }
  },
  {
    uid: '100122',
    name: 'test_project_2',
    desc: 'test project 2 desc',
    archived: false,
    create_time: '2023-05-31T12:21:55.000Z',
    create_user: {
      uid: '100231',
      name: 'test_user1'
    }
  },
  {
    uid: '100133',
    name: 'test_project_3',
    desc: 'test project 3 desc',
    archived: true,
    create_time: '2023-05-21T15:43:10.000Z',
    create_user: {
      uid: '100231',
      name: 'test_user1'
    }
  }
];
