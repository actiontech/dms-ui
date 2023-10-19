import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import {
  DMS_DEFAULT_WEB_TITLE,
  DMS_DEFAULT_WEB_LOGO_URL
} from '@actiontech/shared/lib/data/common';

const DefaultWebTitle = () => (
  <div className="title">
    <span className="label label-primary">Action</span>
    <span className="label label-base">{DMS_DEFAULT_WEB_TITLE}</span>
  </div>
);
const useSystemConfig = () => {
  const webTitle = useSelector((state: IReduxState) => state.system.webTitle);
  const webLogoUrl = useSelector(
    (state: IReduxState) => state.system.webLogoUrl
  );

  const logoSrc = webLogoUrl ?? DMS_DEFAULT_WEB_LOGO_URL;

  const renderWebTitle = () =>
    webTitle === DMS_DEFAULT_WEB_TITLE ? (
      DefaultWebTitle()
    ) : (
      <div className="title">
        <span className="label label-base">{webTitle}</span>
      </div>
    );

  return { logoSrc, renderWebTitle };
};

export default useSystemConfig;
