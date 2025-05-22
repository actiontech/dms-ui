import {
  IResourceListData,
  IResourceTypeDistributionData,
  IResourceOverviewStatisticsResV1,
  IResourceBusiness
} from '../../../../api/base/service/common';

export const mockResourceListData: IResourceListData[] = [
  {
    resource_name: 'test',
    resource_type: 'MySQL',
    resource_uid: '111',
    business_tag: {
      name: 'business-1',
      uid: '1'
    },
    environment_tag: {
      name: 'environment-1',
      uid: '1'
    },
    project: {
      project_name: 'project-1',
      project_uid: '1'
    },
    high_priority_sql_count: 1,
    pending_workflow_count: 1,
    audit_score: 80
  },
  {
    resource_name: 'test-2',
    resource_type: 'Oracle',
    resource_uid: '2',
    business_tag: {
      name: 'business-2',
      uid: '2'
    },
    environment_tag: {
      name: 'environment-2',
      uid: '2'
    },
    project: {
      project_name: 'project-2',
      project_uid: '2'
    },
    high_priority_sql_count: 2,
    pending_workflow_count: 2,
    audit_score: 80
  }
];

export const mockResourceTypeDistributionData: IResourceTypeDistributionData[] =
  [
    {
      resource_type: 'MySQL',
      count: 1
    },
    {
      resource_type: 'Oracle',
      count: 2
    },
    {
      resource_type: 'PostgreSQL',
      count: 3
    }
  ];

export const mockResourceOverviewStatisticsData: IResourceOverviewStatisticsResV1['data'] =
  {
    business_total_number: 1,
    db_service_total_number: 2,
    project_total_number: 3
  };

export const mockResourceOverviewTopologyData: IResourceBusiness[] = [
  {
    business_tag: {
      name: 'business-1',
      uid: '1'
    },
    project: [
      {
        project_name: 'project-1',
        project_uid: '11',
        db_service: [
          {
            db_service_uid: '111',
            db_service_name: 'db_service-1'
          }
        ]
      },
      {
        project_name: 'project-2',
        project_uid: '12',
        db_service: [
          {
            db_service_uid: '121',
            db_service_name: 'db_service-2'
          },
          {
            db_service_uid: '123',
            db_service_name: 'db_service-3'
          }
        ]
      }
    ]
  },
  {
    business_tag: {
      name: 'business-2',
      uid: '2'
    },
    project: []
  },
  {
    business_tag: {
      name: 'business-2',
      uid: '3'
    },
    project: [
      {
        project_name: 'project-1',
        project_uid: '31',
        db_service: []
      }
    ]
  }
];
