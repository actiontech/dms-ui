import { DatabaseTypeLogoProps } from './DatabaseTypeLogo.types';
import { DatabaseTypeLogoStyleWrapper } from './style';

const DatabaseTypeLogo: React.FC<DatabaseTypeLogoProps> = ({
  dbType,
  logoUrl
}) => {
  // todo: 由于DMS的dbTypeLogo还有问题，故暂时保留sqle默认地址`/sqle/v1/static/instance_logo?instance_type=${dbType}`，之后可能会移除dbType的props
  return (
    <DatabaseTypeLogoStyleWrapper>
      <img src={logoUrl} alt="" />
      <span title={dbType}>{dbType}</span>
    </DatabaseTypeLogoStyleWrapper>
  );
};
export default DatabaseTypeLogo;
