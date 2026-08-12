// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'System settings',
  pageDesc:
    'You can configure your email smtp and other system configurations here',
  testConnection: 'Test connectivity',
  confirmCloseConfigTips:
    'Are you sure you want to close the current configuration?',
  confirmResetConfigTips:
    'Closing the configuration will not save the current editing information. are you sure you want to close the configuration?',
  processConnectionCETips:
    "If you use dingtalk, feishu, or enterprise wechat as your collaboration platform and want to approve workflows on these external platforms, you can enable the integrations feature. by integrating workflow approval into your team'S collaboration platform, the approval process will become more convenient, efficient, and traceable, while enhancing data security and team collaboration efficiency.",
  tabPaneTitle: {
    pushNotification: 'Message push',
    processConnection: 'Integrations',
    loginConnection: 'Login connection',
    globalConfiguration: 'Global configuration',
    accessSettings: 'Access settings',
    license: 'License',
    personalize: 'Personalization settings',
    gitSSH: 'Git SSH configuration',
    databaseAccountPasswordPolicy: 'DB Account Password Policy'
  },

  accessSettings: {
    titleTip:
      'Maintain IP/CIDR whitelist and access restriction switch. When enabled, non-whitelisted sources cannot access the system.',
    restrictionSwitch: 'Access restriction',
    addRule: 'Add access rule',
    addRuleTitle: 'Add access rule',
    editRuleTitle: 'Edit access rule',
    useCurrentIp: 'Use current IP',
    whitelistPolicy: 'Whitelist policy',
    sourcePlaceholder: 'Enter IPv4 or CIDR, e.g. 192.168.1.1 or 10.0.0.0/24',
    invalidSource: 'Please enter a valid IPv4 address or IPv4 CIDR',
    columns: {
      source: 'Source',
      policy: 'Access policy',
      remark: 'Remark',
      updatedAt: 'Updated at'
    },
    confirmDelete: 'Are you sure you want to delete this access rule?',
    deleting: 'Deleting access rule...',
    addSuccess: 'Access rule created successfully',
    editSuccess: 'Access rule updated successfully',
    deleteSuccess: 'Access rule deleted successfully',
    enableSuccess: 'Access restriction enabled',
    disableSuccess: 'Access restriction disabled'
  },

  gitSSH: {
    title: 'Git SSH Key Configuration',
    description:
      'Generate an SSH key pair for Git SSH protocol, which can be used to configure SSH authentication on GitHub, GitLab, and other code hosting platforms.',
    generate: 'Generate SSH Key',
    regenerate: 'Regenerate SSH Key',
    generateSuccess: 'SSH key pair generated successfully',
    generateError: 'Failed to generate SSH key pair',
    publicKeyTitle: 'Public Key',
    instructions: 'Instructions',
    step1:
      '1. Copy the public key above and go to the SSH key settings page on your Git hosting platform',
    step2: '2. Add a new SSH key on the platform',
    step3:
      '3. Enter a descriptive title (e.g. "DMS Key"), paste the public key in the key field, and complete the addition'
  },
  title: {
    smtp: 'Smtp',
    wechat: 'Enterprise wechat configuration',
    lark: 'Feishu configuration',
    webhook: 'Webhook configuration',
    ldap: 'Ldap',
    oauth: 'Oauth2.0 configuration',
    larkAudit: 'Feishu approval'
  },
  smtp: {
    enable: 'Enable email push',
    host: 'Smtp address',
    port: 'Smtp port',
    username: 'Smtp username',
    password: 'Smtp password',
    passwordConfirm: 'Confirm smtp password',
    isSkipVerify: 'Skip certificate authentication?',
    skipVerifyTips:
      'Skipping certificates may lead to man-in-the-middle attacks and inability to verify data integrity',
    receiver: 'Recipient email',
    testing: 'Sending a test email to “{{email}}”...',
    testSuccess: 'A test email has been successfully sent to {{email}}.'
  },
  wechat: {
    enable_wechat_notify: 'Enable wechat notification',
    corp_id: 'Corp id (wechat enterprise id)',
    corp_secret: 'Enterprise wechat application secret',
    agent_id: 'Enterprise wechat application id',
    safe_enabled: 'Enable encrypted transmission',
    proxy_ip: 'Proxy server ip',
    receiveWechat: 'Recipient userid',
    receiveWechatTips: 'Enterprise wechat member account',
    testing: 'Sending a test message to {{id}}...',
    testSuccess: 'Test message sent successfully'
  },
  lark: {
    enable: 'Enable feishu push',
    testing: 'Pushing a message to feishu...',
    testSuccess:
      'Message has been successfully pushed to the specified account',
    receiveType: 'Select receive method',
    email: 'Email',
    phone: 'Mobile number'
  },
  webhook: {
    enableWebhookNotify: 'Enable webhook notification',
    maxRetryTimes: 'Maximum retry times',
    retryIntervalSeconds: 'Maximum retry interval (seconds)',
    testing: 'Pushing a test message to {{url}}...',
    testSuccess: 'Test message sent successfully',
    configDocs: 'Webhook configuration document'
  },
  ldap: {
    enableLdap: 'Enable ldap service',
    enableLdapSSL: 'Enable ssl',
    ldapServerHost: 'Ldap server address',
    ldapServerPort: 'Ldap server port',
    ldapConnectDn: 'Connection user dn',
    ldapConnectDnTips:
      'Log in to ldap to query the login interface login user information using this user',
    ldapConnectPwd: 'Connection user password',
    ldapSearchBaseDn: 'Query root dn',
    ldapSearchBaseDnTips:
      'Query root dn, description: query will use this directory as the root directory',
    ldapUserNameRdnKey: 'Username attribute name',
    ldapUserNameRdnKeyTips:
      'The attribute name corresponding to the username bound to SQLE in ldap',
    ldapUserEmailRdnKey: 'User email attribute name',
    ldapUserEmailRdnKeyTips:
      'The attribute name corresponding to the user email bound to SQLE in ldap',
    updatePassword: 'Update connection user password'
  },
  oauth: {
    ceTips:
      "If the user already has a set of common account and password within the company and wants to use this set of common account and password to log in to SQLE, the user can use the platform's oauth2.0 docking function. after enabling and configuring oauth2.0 correctly, the user can use third-party login on the SQLE login interface.\nthus, users can log in using their common account and password, without having to remember another set of SQLE passwords, which can improve the efficiency of enterprise users.",
    featureName: 'User docking oauth2.0',
    enable: 'Enable oauth2.0 login',
    clientId: 'Application id',
    clientIdTips:
      'The unique identifier of the application. apply for it from the platform to be connected. in the oauth2.0 authentication process, the value of appid is the same as the value of oauth_consumer_key.',
    clientSecret: 'Application secret',
    clientSecretTips:
      'The secret corresponding to appid, used to verify the legitimacy of the application when accessing user resources. in the oauth2.0 authentication process, the value of appkey is the same as the value of oauth_consumer_secret. if this item has been configured before, not filling in this item when updating means not updating the secret.',
    clientHost: 'External access address of SQLE',
    clientHostTips: 'Format is http(s)://ip:port',
    serverAuthUrl: 'Oauth2.0 login authorization page address',
    serverAuthUrlTips: 'Format similar to http(s)://ip:port/xxx',
    serverTokenUrl: 'Oauth2.0 access_token acquisition address',
    serverTokenUrlTips: 'Format similar to http(s)://ip:port/xxx',
    serverUserIdUrl: 'Oauth2.0 user id acquisition address',
    serverUserIdUrlTips: 'Format similar to http(s)://ip:port/xxx',
    scopes: 'Request resource scope',
    scopesTips:
      'This scope is defined by the verification server, multiple scopes are separated by commas',
    accessTokenKeyName: 'Access_token key name',
    accessTokenKeyNameTips:
      'SQLE will put the access_token in the value corresponding to this key when obtaining the user id. this parameter will be sent as a parameter of the get request to the user id acquisition address',
    userIdKeyName: 'Json path of user uid',
    userIdKeyNameTips:
      'SQLE will try to use this path to parse the user id from the response of obtaining user information from the third-party platform. the user id should be a unique id',
    userEmailTagName: 'Json path of user email',
    userEmailTagNameTips:
      'SQLE will try to use this path to parse the user email from the response of obtaining user information from the third-party platform',
    userWechatTagName: 'Json path of user wechat id',
    userWechatTagNameTips:
      'SQLE will try to use this path to parse the user wechat id from the response of obtaining user information from the third-party platform',
    loginButtonTextValidateMessage: 'Maximum 28 characters',
    oauth2ButtonText: 'OAuth 2.0 Redirect Button Text',
    oauth2ButtonTextTips: 'OAuth 2.0 login button text on the login page',
    autoCreateUser: 'Automatically create and bind user',
    autoCreateUserTips:
      'If enabled, when logging in through oauth2, if the user is not bound to a SQLE user, SQLE will create a SQLE account based on the user id obtained from the oauth2 server, and will not jump to the binding interface, but enter the SQLE main interface.',
    skipCheckState: 'Skip request source verification',
    skipStateCheckTips:
      'Skip the verification of the request sending source, which may put your account at risk. it is recommended to enable this option only in a trusted environment. after enabling, SQLE will no longer verify the state parameter in the callback.',
    layoutUrl: 'Logout Redirect URL',
    backChannelLogoutUri: 'OIDC Back-Channel Logout Endpoint',
    layoutUrlTips:
      'When the user signs out, the system automatically redirects the browser to this URL to complete logout and terminate the third-party session. Example: http://localhost:8080/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${sqle_url}',
    userPassword: 'Default Login Password',
    userPasswordTips:
      'New users created automatically by the system will use this password as their initial login password. Please keep it safe. For account security, users are advised to change their password after first login. If this was configured before, leaving it blank when updating means the password will not be changed.',
    loginPermissionQueryGJsonExpression:
      'Login Permission Query GJSON Expression',
    loginPermissionQueryGJsonExpressionTips:
      'Query the AccessToken payload JSON with this expression. A non-empty result grants login permission. If left blank, login permission is granted by default.',
    autoBindSameNameUser: 'Auto-Bind Same-Name User',
    autoBindSameNameUserTips:
      'When enabled, if a third-party account signs in via OAuth 2.0 for the first time, the system automatically binds it to an SQLE user with the same username and OAuth 2.0 user UID. This removes the need for manual intervention and allows smoother subsequent operations.',
    enableManuallyBind: 'Manual User Binding',
    enableManuallyBindTips:
      'When OAuth 2.0 sign-in does not find a linked user on SQLE and "Auto-create and bind user" is not enabled, enabling this option takes the user to a manual binding page to link an existing account. If disabled, the system shows an error message.'
  },
  loginBasic: {
    passwordLoginDisabled: 'Disable password login',
    passwordLoginDisabledTips:
      'Prevent non-admin users from logging in with username and password',
    disableMultipleLogin: 'Disable simultaneous multi-device login',
    disableMultipleLoginTips:
      'When enabled, only the latest login session is kept per account; logging in on a new device will force logout on other devices',
    loginButtonText: 'Login button text',
    loginButtonTextTips: 'Login page button text',
    enableOAuthFirst: 'Enable OAuth2.0 login first',
    confirmDisable: 'Are you sure you want to disable this setting?',
    confirmEnableWithLDAP:
      'LDAP relies on password login and will be disabled together. Continue?',
    confirmEnable: 'Are you sure you want to enable this setting?',
    confirmDisableMultipleLogin:
      'When enabled, only the latest login session is kept per account. Continue?',
    confirmEnableMultipleLogin: 'Are you sure you want to disable this setting?'
  },
  dingTalk: {
    titleTips:
      "The approval information will be sent to the corresponding dingtalk account according to the auditor'S mobile number",
    enable: 'Enable DingTalk approval',
    test: 'Test',
    testSuccess: 'Current appkey and appsecret are verified'
  },
  larkAudit: {
    enable: 'Enable Feishu approval',
    test: 'Test',
    titleTips:
      "The approval information will be sent to the corresponding feishu account according to the auditor's mobile number",
    testSuccess:
      'Message has been successfully pushed to the specified account',
    testing: 'Pushing a message to feishu...',
    receiveType: 'Receive method',
    email: 'Email',
    phone: 'Mobile number',
    ceTips:
      "If you use feishu as your collaboration platform and want to approve workflows on feishu, you can enable the feishu approval feature. by integrating workflow approval into your team'S collaboration platform, the approval process will become more convenient, efficient, and traceable, while enhancing data security and team collaboration efficiency.    "
  },
  wechatAudit: {
    titleTips:
      "The approval information will be sent to the corresponding account according to the auditor's wechat enterprise id",
    enable: 'Enable Enterprise WeChat approval',
    test: 'Test',
    testing: 'Pushing a message to enterprise wechat users...',
    testSuccess:
      'Message has been successfully pushed to the specified account',
    corpID: 'Corp id (wechat enterprise id)',
    corpSecret: 'Enterprise wechat application secret',
    wechatUserID: 'Enterprise wechat user id'
  },
  codingDocking: {
    titleTips:
      'Problem SQL in SQL governance can be pushed to Coding for tracking and resolution',
    enable: 'Enable Coding Integration',
    serviceAddress: 'Service URL',
    accessToken: 'Access Token',
    testSuccess: 'Service URL and access token verified successfully',
    codingProjectName: 'Project Name',
    testConnection: 'Test Connectivity',
    testing: 'Testing Coding connectivity...'
  },
  license: {
    productName: 'Data control platform 1.0',
    table: {
      name: 'Name',
      limit: 'Limit'
    },
    form: {
      licenseFile: 'License file'
    },
    collect: 'Collect license information',
    import: 'Import license information',
    importSuccessTips: 'License import successful'
  },
  global: {
    operationRecordExpiredHours: 'Operation record expiration time',
    cbOperationLogsExpiredHours:
      'Cb workstation operation audit expiration time',
    urlAddressPrefix: 'Url address prefix',
    urlAddressPrefixTips:
      'Configure the url address information that can access sqle',
    smsSetting: {
      title: 'Enable SMS Service',
      testSuccess: 'SMS service verified successfully',
      testing: 'Testing SMS service...',
      smsType: 'SMS Service Type',
      urlTips: 'SMS service API URL',
      tokenTips: 'API access token',
      configDocs: 'SMS Service Configuration Docs'
    }
  },
  personalize: {
    title: 'Personalized title',
    match: 'The new title cannot be the same as the old title',
    updateTitleSuccessTips: 'Personalized title update successful',
    logo: 'Personalized logo',
    uploadAndUpdate: 'Upload and update',
    uploadTips: 'Recommended size is 58 × 48 png image',
    limitSize: 'Image size cannot exceed 5mb'
  },
  version: {
    gotIt: 'Got it',
    versionInfo: 'Version information',
    productIntroduction: 'Product introduction',
    productFeatures: 'Features',
    sqle_desc:
      'SQLE is an independently developed sql quality management platform that supports multiple databases, developed by aisino. it is used in sql quality governance during development, testing, release, and production operation phases. through the method of “establishing standards, pre-control, post-supervision, and standard release”, it provides enterprises with the ability to control sql quality throughout its life cycle, while promoting the rapid implementation of internal development standards.',
    sqle_feature:
      '1. meet the use scenarios of mainstream commercial and open source databases, supporting more than ten types of data sources.\n2. provide years of technical precipitation from the operation and maintenance expert team and support independent precipitation of the rule knowledge base.\n3. provide sql intelligent scanning of more than ten types, including slow logs, covering the needs of pre-and post-sql collection.\n4. provide a full-process control perspective of sql, track the progress of solving problematic sql, and provide quick optimization.'
  },
  notification: {
    title: 'System announcement',
    hasDirtyDataTips:
      'The current content has changed. are you sure you want to cancel the modification?',
    successMessage: 'Successfully published system announcement!',
    notData: 'No announcement information',
    validPeriod: 'Valid period',
    startTimePlaceholder: 'Select start time',
    endTimePlaceholder: 'Select end time',
    timeRangeRequired:
      'Please select the effective time range for the announcement',
    timeRangeValidate: 'Start time must be earlier than end time',
    noticeContent: 'Announcement content',
    effectivePeriod: 'Effective period',
    viewFullContent: 'View full content'
  }
};
