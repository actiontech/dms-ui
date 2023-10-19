import './index.less';

const DatabaseTypeLogo: React.FC<{ dbType: string; logoUrl?: string }> = ({
  dbType,
  logoUrl
}) => {
  return (
    <div className="database-type-logo-wrapper">
      <img
        src={logoUrl || `/sqle/v1/static/instance_logo?instance_type=${dbType}`}
        alt=""
      />
      <span title={dbType}>{dbType}</span>
    </div>
  );
};
export default DatabaseTypeLogo;
