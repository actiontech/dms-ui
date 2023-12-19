import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import {
  DMS_DEFAULT_WEB_TITLE,
  DMS_DEFAULT_WEB_LOGO_URL
} from '@actiontech/shared/lib/data/common';
import { IBasicInfo } from '@actiontech/shared/lib/api/base/service/common';
import { useDispatch } from 'react-redux';
import { updateWebTitleAndLogo } from '../../store/system';

const DefaultWebTitle: React.FC = () => (
  <div className="title">
    <span className="label label-primary">Action</span>
    <span className="label label-base">{DMS_DEFAULT_WEB_TITLE}</span>
  </div>
);
const useSystemConfig = () => {
  const { webTitle, webLogoUrl } = useSelector((state: IReduxState) => ({
    webTitle: state.system.webTitle,
    webLogoUrl: state.system.webLogoUrl
  }));

  const logoSrc = webLogoUrl ?? DMS_DEFAULT_WEB_LOGO_URL;
  const dispatch = useDispatch();

  const renderWebTitle = () =>
    webTitle === DMS_DEFAULT_WEB_TITLE ? (
      <DefaultWebTitle />
    ) : (
      <div className="title">
        <span className="label label-base">{webTitle}</span>
      </div>
    );

  const syncWebTitleAndLogo = (basicInfo: IBasicInfo) => {
    const resTitle = !!basicInfo?.title
      ? basicInfo.title
      : DMS_DEFAULT_WEB_TITLE;

    const resLogoUrl = !!basicInfo?.logo_url
      ? `${basicInfo?.logo_url}?temp=${new Date().getTime()}`
      : DMS_DEFAULT_WEB_LOGO_URL;

    document.title = resTitle;

    const favIconNode = document.getElementById(
      'dms-logo-favicon'
    ) as HTMLLinkElement;
    favIconNode.href = resLogoUrl;

    dispatch(
      updateWebTitleAndLogo({
        webTitle: resTitle,
        webLogoUrl: resLogoUrl
      })
    );
  };

  return { logoSrc, renderWebTitle, syncWebTitleAndLogo };
};

export default useSystemConfig;
