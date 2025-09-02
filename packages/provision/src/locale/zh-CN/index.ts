import provisionUser from './provisionUser';
import dataObject from './dataObject';
import operation from './operation';
import auth from './auth';
import provisionAudit from './provisionAudit';
import externalDataSource from './externalDataSource';
import provisionNav from './provisionNav';
import databaseAccount from './databaseAccount';
import passwordSecurityPolicy from './passwordSecurityPolicy';
import databaseRole from './databaseRole';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    provisionUser,
    dataObject,
    operation,
    auth,
    provisionAudit,
    externalDataSource,
    provisionNav,
    databaseAccount,
    passwordSecurityPolicy,
    databaseRole
  }
};
