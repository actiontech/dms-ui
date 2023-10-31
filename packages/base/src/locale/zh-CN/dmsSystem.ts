// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',
  testConnection: '测试连通性',
  cancelConfigConfirm: '是否确认关闭当前配置？',

  tabPaneTitle: {
    pushNotification: '消息推送',
    processConnection: '流程对接',
    loginConnection: '登录对接',
    globalConfiguration: '全局配置',
    license: '许可证',
    personalize: '个性化设置'
  },

  title: {
    smtp: 'SMTP',
    wechat: '企业微信配置',
    lark: '飞书配置',
    webhook: 'Webhook配置',
    ldap: 'LDAP',
    oauth: 'Oauth2.0配置'
  },

  smtp: {
    enable: '启用邮件推送',
    host: 'SMTP地址',
    port: 'SMTP端口',
    username: 'SMTP用户名',
    password: 'SMTP密码',
    passwordConfirm: '确认SMTP密码',
    isSkipVerify: '是否跳过证书认证',
    skipVerifyTips: '跳过证书可能会遇到中间人攻击以及无法验证数据完整性等问题',

    receiver: '接收邮箱',
    testing: '正在向 “{{email}}” 发送测试邮件...',
    testSuccess: '已成功向 {{email}} 发送测试邮件。'
  },

  wechat: {
    enable_wechat_notify: '是否启用微信通知',
    corp_id: 'CorpID(微信企业号ID)',
    corp_secret: '企业微信应用Secret',
    agent_id: '企业微信应用ID',
    safe_enabled: '是否开启加密传输',
    proxy_ip: '代理服务器IP',

    receiveWechat: '接收者UserID',
    receiveWechatTips: '企业微信成员账号',
    testing: '正在向{{id}}发送测试消息...',
    testSuccess: '测试消息发送成功'
  },

  lark: {
    enable: '是否启用飞书推送',
    testing: '正在向飞书推送消息...',
    testSuccess: '已成功将消息推送至指定账号',
    receiveType: '选择接收方式',
    email: '邮箱',
    phone: '手机号'
  },

  webhook: {
    enableWebhookNotify: '是否开启Webhook通知',
    maxRetryTimes: '最大重试次数',
    retryIntervalSeconds: '最大重试间隔(秒)',
    testing: '正在向{{url}}推送测试信息...',
    testSuccess: '测试消息发送成功',
    configDocs: 'webhook配置文档'
  },

  ldap: {
    enableLdap: '是否启用LDAP服务',
    enableLdapSSL: '是否启用SSL',
    ldapServerHost: 'LDAP服务器地址',
    ldapServerPort: 'LDAP服务器端口',
    ldapConnectDn: '连接用户DN',
    ldapConnectDnTips: '通过此用户登录ldap查询login界面登录用户的信息',
    ldapConnectPwd: '连接用户密码',
    ldapSearchBaseDn: '查询根DN',
    ldapSearchBaseDnTips: '查询根DN, 描述: 查询时会以此目录作为根目录进行查询',
    ldapUserNameRdnKey: '用户名属性名',
    ldapUserNameRdnKeyTips: 'SQLE绑定的用户名在LDAP中对应的属性名',
    ldapUserEmailRdnKey: '用户邮箱属性名',
    ldapUserEmailRdnKeyTips: 'SQLE绑定的用户邮箱在LDAP中对应的属性名'
  },

  oauth: {
    ceTips:
      '如果用户已有一套公司内的通用账号密码，想要用这套通用账号密码来登录SQLE时，用户可使用平台的OAuth2.0对接功能，开启并正确配置OAuth2.0，即可在SQLE登录界面使用第三方登录。\n由此，用户可以使用通用账号密码登录，无需额外再记录一套SQLE密码，可提高企业用户工作效率。',
    featureName: '用户对接OAuth2.0',

    enable: '是否启用oauth登录',
    clientId: '应用 ID',
    clientIdTips:
      '应用的唯一标识, 从要对接的平台申请 , 在OAuth2.0认证过程中，appid的值即为oauth_consumer_key的值。',

    clientSecret: '应用密钥',
    clientSecretTips:
      'appid对应的密钥，访问用户资源时用来验证应用的合法性。在OAuth2.0认证过程中，appkey的值即为oauth_consumer_secret的值。如果之前配置过该项，更新时不填写该项代表不更新密钥。',
    clientHost: '外部访问SQLE的地址',
    clientHostTips: '格式为 http(s)://ip:port',

    serverAuthUrl: 'oauth2登录授权页面地址',
    serverAuthUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverTokenUrl: 'oauth2 access_token 获取地址',
    serverTokenUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverUserIdUrl: 'oauth2 user id 获取地址',
    serverUserIdUrlTips: '格式类似于 http(s)://ip:port/xxx',

    scopes: '请求资源范围',
    scopesTips: '	此范围由验证服务器定义,多个范围用逗号分隔',

    accessTokenKeyName: 'access_token Key名称',
    accessTokenKeyNameTips:
      'sqle会在获取用户ID时将access_token放在这个key对应的value中, 此参数会作为get请求的参数发送给用户ID获取地址',

    userIdKeyName: 'user_id Key名称',
    userIdKeyNameTips:
      'sqle会尝试使用此key从第三方平台的响应中解析出用户ID,用户ID应当为唯一ID',

    loginButtonText: '登录按钮文字',
    loginButtonTextTips: 'login页面oauth登录按钮文字',
    loginButtonTextValidateMessage: '最多输入28个字符'
  },

  dingTalk: {
    titleTips: '审批信息将根据审核人的手机号发送到相应的钉钉账号',
    enable: '启用钉钉审批',
    test: '测试',
    testSuccess: '当前AppKey和AppSecret验证通过'
  },

  license: {
    productName: '数据管控平台1.0',
    table: {
      name: '名称',
      limit: '限制'
    },

    form: {
      licenseFile: 'License文件'
    },

    collect: '收集许可信息',
    import: '导入许可信息',
    importSuccessTips: '导入License成功'
  },

  global: {
    orderExpiredHours: '已完成的工单自动过期时间',
    operationRecordExpiredHours: '操作记录过期时间',
    urlAddressPrefix: 'URL地址前缀',
    urlAddressPrefixTips: '配置能访问SQLE的url地址信息',
    urlAddressFormatTips: '格式为 http(s)://ip:port/sqle'
  },

  personalize: {
    title: '个性化标题',
    match: '新标题不能与旧标题一致',
    updateTitleSuccessTips: '个性化标题更新成功',

    logo: '个性化Logo',
    uploadAndUpdate: '上传并更新',
    uploadTips: '建议尺寸为 58 × 48 的png图片',
    limitSize: '图片大小不能超过5MB'
  },

  version: {
    gotIt: '知道了',
    versionInfo: '版本信息',
    productIntroduction: '产品简介',
    productFeatures: '功能特点',
    dms_desc:
      'SQLE 是爱可生自主研发，支持多元数据库的 SQL 质量管理平台。应用于开发、测试、上线发布、生产运行阶段的 SQL 质量治理。通过 “建立规范、事前控制、事后监督、标准发布” 的方式，为企业提供 SQL 全生命周期质量管控能力，同时推动企业内部开发规范快速落地。',
    dms_feature: `1. 满足主流商业及开源数据库使用场景，支持十余种数据源类型。
        2. 提供运维专家团队多年的技术沉淀，并支持规则知识库的自主沉淀。
        3. 提供慢日志等十几种的 SQL智能扫描，覆盖事前事后 SQL 采集需求。
        4. 提供SQL全流程的管控视角，追踪问题SQL解决进度、并提供快捷优化。`
  }
};
