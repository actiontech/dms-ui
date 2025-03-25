// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: 'SQL 감사',
    action: {
      create: '감사 생성',
      updateTags: {
        successTips: '비즈니스 태그 업데이트 성공',
        addTag: {
          text: '비즈니스 태그 추가',
          notTags: '태그 데이터 없음',
          placeholder: '새 비즈니스 태그를 입력해 주세요'
        }
      }
    },
    filter: {
      instanceName: 'DB 인스턴스',
      auditTime: '감사 시간',
      inputTagPlaceholder: '검색할 비즈니스 태그를 입력해 주세요'
    },
    status: {
      auditStatus: {
        auditing: '감사 중',
        successfully: '감사 성공'
      }
    },
    columns: {
      auditID: '감사 ID',
      auditStatus: '감사 상태',
      businessTag: '비즈니스 태그',
      auditRating: '점수',
      auditPassRate: '감사 통과율 (%)',
      createUser: '생성자',
      auditTime: '감사 시간',
      instanceName: 'DB 인스턴스'
    }
  },
  common: {
    goBackList: 'SQL 감사 목록으로 돌아가기'
  },
  detail: {
    download: '감사 결과 다운로드',
    auditID: '감사 ID',
    auditRating: '감사 등급',
    auditPassRate: '감사 통과율'
  },
  create: {
    title: 'SQL 감사 생성',
    createTagErrorTips: '현재 태그가 이미 존재합니다',
    successTips: '감사 생성 성공',
    baseInfoForm: {
      tags: '비즈니스 태그',
      tagsPlaceholder: '검색할 비즈니스 태그'
    },
    sqlInfo: {
      title: '감사 SQL 문 정보',
      audit: '감사',
      format: 'SQL 미화',
      formatTips:
        '현재 SQL 미화를 지원하는 데이터베이스 유형은 {{supportType}}입니다. 데이터 소스를 선택하지 않았거나 선택한 데이터 소스 유형이 지원되지 않는 경우, SQL 미화로 인해 SQL 문에 구문 오류가 발생할 수 있습니다.',
      form: {
        auditType: '감사 방법',
        auditTypeDesc:
          '온라인 감사 중에는 플랫폼 감사가 선택한 데이터 소스의 실제 데이터베이스 스키마를 기반으로 제안을 제공합니다. 오프라인 감사 중에는 플랫폼 감사가 데이터 소스에 연결하지 않습니다.',
        dbType: '데이터베이스 유형',
        instanceName: 'DB 인스턴스',
        instanceSchema: '데이터베이스',
        staticAudit: '오프라인 감사',
        dynamicAudit: '온라인 감사',
        uploadType: 'SQL 문 업로드 방법 선택'
      },
      uploadTypeEnum: {
        sql: 'SQL 문 입력',
        sqlFile: 'SQL 파일 업로드',
        mybatisFile: 'Mybatis XML 파일 업로드',
        zipFile: 'ZIP 파일 업로드',
        git: 'GIT 저장소 구성'
      },

      uploadLabelEnum: {
        sql: 'SQL 문',
        sqlFile: 'SQL 파일',
        mybatisFile: 'Mybatis XML 파일',
        zipFile: 'ZIP 파일',
        gitUrl: 'GIT 주소',
        gitUrlTips:
          'git 저장소의 HTTP(S) 복제 주소를 입력하세요. 비공개 GIT 저장소인 경우 읽기 권한이 있는 계정과 비밀번호를 입력해야 합니다'
      },
      uploadFileTip: {
        sqlFile:
          'SQL 파일을 선택하려면 클릭하거나 파일을 이 영역으로 끌어다 놓으세요',
        mybatisFile:
          'Mybatis XML 파일을 선택하려면 클릭하거나 파일을 이 영역으로 끌어다 놓으세요',
        zipFile:
          'ZIP 파일을 선택하려면 클릭하거나 파일을 이 영역으로 끌어다 놓으세요. 현재 ZIP 파일 내의 .xml 및 .sql 파일만 SQL 감사를 수행할 수 있습니다'
      }
    }
  },
  result: {
    deleteRuleTip: '규칙이 삭제되었습니다'
  }
};
