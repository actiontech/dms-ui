import store from '../../../../../base/src/store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
  updateUserUid
} from '../../../../../base/src/store/user';
import { createBrowserHistory } from 'history';

const globalAuthInvalid = () => {
  store.dispatch(updateToken({ token: '' }));
  store.dispatch(updateUser({ username: '', role: '' }));
  store.dispatch(updateUserUid({ uid: '' }));
  store.dispatch(updateManagementPermissions({ managementPermissions: [] }));
  store.dispatch(updateBindProjects({ bindProjects: [] }));
  const history = createBrowserHistory();
  history.push('/login');
};

export default globalAuthInvalid;
