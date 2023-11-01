import { DatabaseTypeLogoStyleWrapper } from './style';

const DatabaseTypeLogo: React.FC<{ dbType: string; logoUrl?: string }> = ({
  dbType,
  logoUrl
}) => {
  return (
    <DatabaseTypeLogoStyleWrapper>
      <img
        src={logoUrl || `/sqle/v1/static/instance_logo?instance_type=${dbType}`}
        alt=""
      />
      <span title={dbType}>{dbType}</span>
    </DatabaseTypeLogoStyleWrapper>
  );
};
export default DatabaseTypeLogo;
