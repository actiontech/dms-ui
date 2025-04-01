// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '알림',
  pushRule: {
    title: '구성',
    workflowUpdateNotifier: {
      label: '워크플로우 업데이트 알림',
      labelTips:
        '워크플로우 상태가 변경되면 작업 권한이 있는 멤버에게 자동으로 푸시됩니다',
      pushFrequency: '알림 빈도',
      pushFrequencyTips:
        'crontab 형식에 따라 알림을 예약합니다. 현재 표시 시간은 브라우저 로컬 시간을 기준으로 합니다. 정확한 시간은 서버 시간에 의해 결정됩니다.',
      pushFrequencyValueFormatter: '다음 알림 시간은 {{time}}입니다',
      pushFrequencyErrorTips: '현재 crontab 표현식 형식이 올바르지 않습니다!',
      pushFrequencyEmptyTips: '현재 crontab 표현식이 비어 있습니다!',
      pusher: '푸셔',
      lastPushTime: '마지막 알림 시간',
      permissionMatch: '권한에 따라 작업 권한이 있는 멤버와 일치',
      immediately: '워크플로우 상태 변경에 따라 즉시 트리거',
      successTips: '업데이트 성공!',
      enabledConfirmTitle: '이 작업은 구성을 활성화합니다. 계속하시겠습니까?',
      closedConfirmTitle: '이 작업은 구성을 닫습니다. 계속하시겠습니까?'
    },

    sqlManagementIssuePush: {
      CETips:
        '높은 우선순위 SQL 표준을 구성하고 이러한 잠재적 문제 SQL을 적시에 파악하여 더 큰 사고를 방지하려면 SQL 관리 알림 기능을 활성화할 수 있습니다. 플랫폼은 관심 있는 문제 SQL을 적시에 노출합니다.',
      label: 'SQL 관리 이슈 푸시',
      labelTips:
        'SQL 관리에 문제가 있는 SQL이 있으면 지정된 멤버에게 자동으로 푸시됩니다',
      pushFrequency: '알림 빈도',
      pusher: '푸셔',
      lastPushTime: '마지막 알림 시간',
      closedConfirmTitle:
        '구성을 닫으면 현재 편집 정보가 보존되지 않습니다. 구성을 닫으시겠습니까?',
      form: {
        pushFrequency: '알림 빈도',
        pushFrequencyValidator: '양의 정수를 입력하세요',
        pusher: '푸셔',
        cronTips:
          'crontab 형식 시간을 수동으로 입력하거나 오른쪽 버튼을 클릭하여 시각적 선택을 활성화합니다'
      }
    },
    SqlManagementQualityReport: {}
  }
};
