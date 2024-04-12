import {
  IListProject,
  IPreviewImportProjects,
  IProjectTips
} from '@actiontech/shared/lib/api/base/service/common';

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
    },
    business: [
      {
        id: 'business1',
        name: 'business1',
        is_used: true
      }
    ],
    is_fixed_business: true
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
    },
    business: [
      {
        id: 'business1',
        name: 'business1',
        is_used: true
      },
      {
        id: 'business2',
        name: 'business2',
        is_used: false
      },
      {
        id: 'business3',
        name: 'business3',
        is_used: true
      }
    ],
    is_fixed_business: true
  }
];

export const mockPreviewImportProjects: IPreviewImportProjects[] = [
  {
    name: 'project1',
    business: ['business1', 'business2', 'business3'],
    desc: 'desc1'
  },
  {
    name: 'project2',
    business: ['business1'],
    desc: ''
  },
  {
    name: 'project3',
    business: ['']
  },
  {
    name: ''
  }
];

export const mockProjectTips: IProjectTips[] = [
  {
    is_fixed_business: true,
    business: ['business1', 'business2', 'business3']
  }
];
