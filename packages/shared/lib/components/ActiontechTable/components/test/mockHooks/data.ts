export const mockUseTableSettingsData = {
  localColumns: {
    workflow_id: {
      order: 1,
      show: true,
      fixed: 'left',
      title: '工单号'
    },
    desc: {
      order: 7,
      show: true,
      title: '工单描述',
      fixed: 'right'
    },
    create_time: {
      order: 3,
      show: true,
      title: '创建时间'
    }
  },
  catchDefaultColumnsInfo: jest.fn()
};
