/* eslint-disable no-template-curly-in-string */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',
  testConnection: '测试连通性',
  confirmCloseConfigTips: '是否确认关闭当前配置？',
  confirmResetConfigTips:
    '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？',
  processConnectionCETips:
    '如果您使用钉钉、飞书、企业微信作为协作平台，并且希望在这些外部平台上进行工单审批，您可以启用流程对接功能。通过将工单审批集成到团队的协作平台中，审批过程将变得更加便捷、高效和可追溯，同时提升数据安全和团队协作的效率。',
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
    oauth: 'Oauth2.0配置',
    larkAudit: '飞书审批'
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

    enable: '是否启用OAuth2.0登录',
    clientId: '应用 ID',
    clientIdTips:
      '应用的唯一标识, 从要对接的平台申请 , 在OAuth2.0认证过程中，appid的值即为oauth_consumer_key的值。',

    clientSecret: '应用密钥',
    clientSecretTips:
      'appid对应的密钥，访问用户资源时用来验证应用的合法性。在OAuth2.0认证过程中，appkey的值即为oauth_consumer_secret的值。如果之前配置过该项，更新时不填写该项代表不更新密钥。',
    clientHost: '外部访问SQLE的地址',
    clientHostTips: '格式为 http(s)://ip:port',

    serverAuthUrl: 'OAuth2.0登录授权页面地址',
    serverAuthUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverTokenUrl: 'OAuth2.0 access_token 获取地址',
    serverTokenUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverUserIdUrl: 'OAuth2.0 user id 获取地址',
    serverUserIdUrlTips: '格式类似于 http(s)://ip:port/xxx',

    scopes: '请求资源范围',
    scopesTips: '	此范围由验证服务器定义,多个范围用逗号分隔',

    accessTokenKeyName: 'access_token Key名称',
    accessTokenKeyNameTips:
      'sqle会在获取用户ID时将access_token放在这个key对应的value中, 此参数会作为get请求的参数发送给用户ID获取地址',

    userIdKeyName: '用户UID的JSON路径',
    userIdKeyNameTips:
      'sqle会尝试使用此路径，从第三方平台获取用户信息的响应中解析出用户ID，用户ID应当为唯一ID',
    userEmailTagName: '用户邮箱的JSON路径',
    userEmailTagNameTips:
      'sqle会尝试使用此路径，从第三方平台获取用户信息的响应中解析出用户邮箱',
    userWechatTagName: '用户微信ID的JSON路径',
    userWechatTagNameTips:
      'sqle会尝试使用此路径，从第三方平台获取用户信息的响应中解析出用户微信ID',

    loginButtonText: '登录按钮文字',
    loginButtonTextTips: 'login页面OAuth2.0登录按钮文字',
    loginButtonTextValidateMessage: '最多输入28个字符',

    autoCreateUser: '自动创建并绑定用户',
    autoCreateUserTips:
      '若开启，在通过OAuth2登陆时，若该用户未绑定SQLE用户，SQLE则会根据从OAuth2服务端获取的用户id创建SQLE账户，并且不会跳转到绑定界面，而是进入SQLE主界面。',
    skipCheckState: '跳过请求来源验证',
    skipStateCheckTips:
      '跳过对请求发送来源的验证，可能会使您的账户面临安全风险，建议仅在可信环境下启用此选项。启用后，SQLE将不再验证回调中的state参数。',
    layoutUrl: '注销跳转地址',
    layoutUrlTips:
      '用户登出时，系统自动将用户引导至此地址以确认注销操作，并在确认后安全关闭当前会话，以保护您的登录信息不被泄露。格式示例：http://localhost:8080/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${sqle_url}',
    userPassword: '默认登录密码',
    userPasswordTips:
      '系统自动创建的新用户将使用此密码作为初始登录密码。为保证账户安全，建议用户首次登录后及时修改密码。如果之前配置过该项，更新时不填写该项代表不更新密钥。'
  },

  dingTalk: {
    titleTips: '审批信息将根据审核人的手机号发送到相应的钉钉账号',
    enable: '启用钉钉审批',
    test: '测试',
    testSuccess: '当前AppKey和AppSecret验证通过'
  },

  larkAudit: {
    enable: '启用飞书审批',
    test: '测试',
    titleTips: '审批信息将根据审核人的手机号发送到相应的飞书账号',
    testSuccess: '已成功将审批消息推送至指定账号',
    testing: '正在向飞书推送消息...',
    receiveType: '接收方式',
    email: '邮箱',
    phone: '手机号',
    ceTips:
      '如果您使用飞书作为协作平台，并且希望在飞书上进行工单审批，您可以启用飞书审批功能。通过将工单审批集成到团队的协作平台中，审批过程将变得更加便捷、高效和可追溯，同时提升数据安全和团队协作的效率。    '
  },

  wechatAudit: {
    titleTips: '审批信息将根据审核人的微信企业号ID发送到相应的账号',
    enable: '启用企业微信审批',
    test: '测试',
    testing: '正在向企业微信用户推送消息...',
    testSuccess: '已成功将消息推送至指定账号',
    corpID: 'CorpID(微信企业号ID)',
    corpSecret: '企业微信应用Secret',
    wechatUserID: '企业微信用户ID'
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
    operationRecordExpiredHours: '操作记录过期时间',
    cbOperationLogsExpiredHours: 'CB工作台操作审计过期时间',
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
    sqle_desc:
      'SQLE 是爱可生自主研发，支持多元数据库的 SQL 质量管理平台。应用于开发、测试、上线发布、生产运行阶段的 SQL 质量治理。通过 “建立规范、事前控制、事后监督、标准发布” 的方式，为企业提供 SQL 全生命周期质量管控能力，同时推动企业内部开发规范快速落地。',
    sqle_feature:
      '1. 满足主流商业及开源数据库使用场景，支持十余种数据源类型。\n2. 提供运维专家团队多年的技术沉淀，并支持规则知识库的自主沉淀。\n3. 提供慢日志等十几种的 SQL智能扫描，覆盖事前事后 SQL 采集需求。\n4. 提供SQL全流程的管控视角，追踪问题SQL解决进度、并提供快捷优化。'
  },
  notification: {
    title: '系统公告',
    hasDirtyDataTips: '当前内容已经发生更改，是否确认取消修改？',
    successMessage: '成功发布系统公告!',
    notData: '暂无公告信息'
  }
};
