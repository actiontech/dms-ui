// eslint-disable-next-line import/no-anonymous-default-export
export default {
  username: '사용자 이름',
  password: '비밀번호',

  unknownError: '알 수 없는 오류...',
  unknownStatus: '알 수 없는 상태...',
  unknown: '알 수 없음',
  status: '상태',

  all: '전체',
  enabled: '활성화됨',
  notEnabled: '활성화되지 않음',
  disabled: '비활성화됨',

  opened: '열림',
  notOpen: '열리지 않음',

  copied: '성공적으로 복사됨',
  true: '예',
  false: '아니오',
  refresh: '새로고침',
  ok: '확인',
  cancel: '취소',
  submit: '제출',
  close: '닫기',
  edit: '편집',
  modify: '수정',
  manage: '관리',
  delete: '삭제',
  add: '추가',
  clear: '지우기',
  activate: '활성화',
  reset: '초기화',
  resetAll: '모두 초기화',
  search: '검색',
  retry: '재시도',
  back: '뒤로',
  more: '더 보기',
  upload: '파일 업로드',
  resetAndClose: '닫고 양식 초기화',
  operateSuccess: '작업 성공',
  operate: '작업',
  tips: '알림',
  hide: '숨기기',
  wait: '기다려 주세요',
  save: '저장',
  open: '열기',
  alreadyUsed: '이미 사용 중',
  userNumber: '사용자 번호',
  generate: '생성',
  generatePasswordSuccess:
    '16자리 비밀번호가 생성되어 클립보드에 복사되었습니다',
  test: '테스트',
  download: '다운로드',
  uploadAndUpdate: '업로드 및 업데이트',

  prevStep: '이전 단계',
  nextStep: '다음 단계',

  expansion: '확장',
  collapse: '접기',

  showAll: '모두 보기',
  showDetail: '상세 보기',
  showMore: '더 보기',

  in: '안에',
  on: '켜짐',
  and: '그리고',
  at: '안에',
  preview: '미리보기',

  success: '성공',
  fail: '실패',

  theme: {
    light: '라이트 모드',
    dark: '다크 모드'
  },

  logout: '로그아웃',
  account: '개인 센터',

  copySuccess: '성공적으로 복사됨',
  clickHere: '여기를 클릭',

  request: {
    noticeFailTitle: '요청 오류'
  },

  tip: {
    net_error: '데이터 연결 예외, 네트워크를 확인해 주세요',
    no_data: '데이터 없음',
    no_rule_data: '더 이상 규칙 없음',
    selectFile: '파일을 선택해 주세요'
  },

  time: {
    hour: '시간',
    year: '년',
    month: '월',
    day: '일',
    week: '주',
    minute: '분',
    everyDay: '매일',
    everyWeek: '매주',
    permanent: '영구적',
    oneYear: '1년',
    oneMonth: '1개월',
    oneWeek: '1주일',
    per: '마다'
  },

  week: {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일'
  },

  form: {
    placeholder: {
      input: '{{name}}을(를) 입력해 주세요',
      select: '{{name}}을(를) 선택해 주세요',
      upload: '{{name}}을(를) 업로드해 주세요',
      searchInput: '검색하려는 {{name}}을(를) 입력해 주세요',
      searchSelect: '검색하려는 {{name}}을(를) 선택해 주세요'
    },

    rule: {
      require: '{{name}}은(는) 필수 입력 항목입니다',
      selectFile: '파일을 선택해야 합니다',
      passwordNotMatch: '입력한 두 비밀번호가 일치하지 않습니다',
      passwordConfirmTips: '입력한 두 비밀번호가 일치하는지 확인해 주세요',
      email: '유효한 이메일 주소를 입력해 주세요',
      phone: '유효한 휴대폰 번호를 입력해 주세요',
      startWithLetter: '문자로 시작해야 합니다',
      onlyLetterAndNumber: '문자, 숫자, 하이픈, 밑줄만 포함할 수 있습니다',
      startWithWords: '문자나 한자로 시작해야 합니다',
      onlyWordsAndNumber: '한자, 문자, 숫자, 하이픈, 밑줄만 포함할 수 있습니다',
      cidr: '유효한 ipv4와 마스크를 입력해 주세요',
      onlyNumber: '숫자만 포함할 수 있습니다',
      portRange: '포트 범위는 {{min}}-{{max}}입니다',
      integer: '양의 정수만 입력할 수 있습니다',
      numberRange: '{{name}}의 범위는 {{min}}-{{max}} 사이의 양의 정수입니다',
      maxLength: '최대 {{max}}자까지 가능합니다',
      nameRule: '문자, 숫자, 한자, 하이픈, 밑줄만 포함할 수 있습니다'
    }
  },

  cron: {
    mode: {
      select: '시각적 선택',
      manual: '수동 입력'
    },

    label: {
      interval: '빈도',
      point: '시간점'
    },

    time: {
      everyDay: '매일',
      everyWeek: '매주'
    },

    errorMessage: {
      invalid: '유효하지 않은 cron 표현식',
      mustBeString: 'Cron 표현식은 문자열이어야 합니다',
      mustBeArray: '변경된 값은 배열이어야 합니다',
      lenMustBeFive:
        'Cron 표현식은 (분 시 일 월 주) 5개 요소만 포함해야 합니다',
      onlyHaveValidChar:
        'Cron 표현식은 숫자, 하이픈(-), 슬래시(/), 쉼표(,)만 포함할 수 있습니다',
      limit:
        '표현식에 유효하지 않은 숫자 범위가 포함되어 있습니다. 분(0-59), 시(0-23), 일(1-31), 월(1-12), 주(0-6)'
    },

    placeholder: '시간을 입력해 주세요',

    subTitle: {
      auditsFrequency: '빈도',
      timerPoint: '시간점'
    },

    week: {
      Sun: '일요일',
      Mon: '월요일',
      Tue: '화요일',
      Wed: '수요일',
      Thu: '목요일',
      Fri: '금요일',
      Sat: '토요일'
    }
  },

  maintenanceTimePicker: {
    placeholder: '시간 기간을 선택해 주세요',
    duplicate: '동일한 시간 기간을 반복적으로 추가할 수 없습니다',
    range: '시간 기간'
  },

  testDatabaseConnectButton: {
    testDatabaseConnection: '데이터 소스 연결 테스트',
    testing: '연결 시도 중...',
    testSuccess: '데이터 소스 연결 테스트 성공',
    testFailed: '데이터 소스 연결 실패'
  },

  sqlStatements: 'SQL 문',

  enterpriseFeatureDisplay: {
    featureDescription: '기능 설명',
    additionalAttention: '추가 주의사항',
    businessLink:
      '{{featureName}}은(는) 기업 버전 기능입니다. 이 기능을 사용하려면 다음 링크를 통해 문의하세요.',
    compareLink:
      '기업 버전과 커뮤니티 버전의 차이점에 대해 더 알고 싶으시면 사용자 매뉴얼을 참조하세요.',
    userBook: '사용자 매뉴얼',
    linkUs: 'Actionstech 공식 웹사이트'
  },

  actiontechTable: {
    searchInput: {
      placeholder: '키워드를 입력하여 검색'
    },

    filterButton: {
      filter: '필터',
      clearFilter: '필터 닫기'
    },

    setting: {
      buttonText: '테이블 설정',
      fixedLeft: '왼쪽에 고정',
      fixedRight: '오른쪽에 고정',
      noFixed: '고정되지 않음'
    },

    filterContainer: {
      rangePickerPlaceholderStart: '시작 시간',
      rangePickerPlaceholderEnd: '종료 시간'
    },

    pagination: {
      total: '총 {{total}}개 레코드'
    }
  },

  version: {
    currentVersion: '현재 버전',
    ce: '커뮤니티 에디션',
    ee: '엔터프라이즈 에디션',
    demo: '프로페셔널 에디션',
    startApply: '시험 사용 시작',
    ceDesc:
      'MySQL 데이터 소스 관리 지원\n리소스 권한 격리 지원\nCloudBeaver 온라인 쿼리 통합\n전문적인 SQL 감사 기능 제공\nMySQL 데이터 수집을 위한 여러 방법 지원\n인스턴스 제한 없음',
    demoDesc:
      '10개 이상의 주요 데이터 소스 관리 지원\n리소스 권한 격리 지원\nCloudBeaver 온라인 쿼리 통합\n전문적인 SQL 감사 기능 제공\n다양한 데이터 소스에서 데이터 수집을 위한 여러 방법 지원\n최대 인스턴스 수 20개',
    eeDesc:
      '10개 이상의 주요 데이터 소스 관리 지원\n리소스 권한 격리 지원\nCloudBeaver 온라인 쿼리 통합\n전문적인 SQL 감사 기능 제공\n다양한 데이터 소스에서 데이터 수집을 위한 여러 방법 지원\n인스턴스 제한 없음\n다차원 지능형 통계\n개인화된 맞춤 설정',
    ceSubTitle: 'MySQL 기본 감사 시나리오에 적합',
    demoSubTitle: '다양한 데이터 소스 유형 체험 시나리오에 적합',
    eeSubTitle: '프라이빗 클라우드 사용자 맞춤 시나리오에 적합',
    ceTitle: '무료',
    demoTitle: '무료',
    eeTitle: '맞춤형',
    ceTerm: '영구적',
    demoTerm: '영구적',
    ceButtonText: '빠른 배포',
    demoButtonText: '지금 신청',
    eeButtonText: '문의하기',
    bottomDesc: '각 버전의 전체 기능 비교는 다음을 참조하세요:',
    functionalComparison: '기능 비교'
  }
};
