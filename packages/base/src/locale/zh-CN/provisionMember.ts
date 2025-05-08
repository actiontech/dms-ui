/* eslint-disable import/no-anonymous-default-export */
export default {
  checkMemberGroupAuth: {
    errorTitle: '成员组授权检查失败',
    conflictTitle: '发现以下授权冲突：',
    userConflictTips1: '检测到成员 ',
    userConflictTips2: ' 存在权限冲突，该用户当前权限：',
    currentAuth: '当前授权',
    directAuthTips: '直接授权',
    currentDirectAuth: '直接授权：',
    currentGroupAuth: '成员组授权：',
    noAuth: '无',
    conflictDesc: '冲突说明：',
    conflictDetailTips1: '将该用户加入组 ',
    conflictDetailTips2: ' 后，该用户将同时拥有以下账号：',
    securityRequirement:
      '根据安全要求，同一用户在同一数据源上只能使用一个账号。',
    throughGroup: '通过 {{groupName}} 获得',
    securityAlert: '安全提示',
    securityAlertDesc:
      '根据安全要求，同一用户在同一数据源上只能使用一个账号。请检查并解决以下冲突后再继续操作。',
    viewCurrentUserAuthDetail: '查看当前用户授权详情',
    viewCurrentGroupAuthDetail: '查看当前成员组授权详情'
  }
};
