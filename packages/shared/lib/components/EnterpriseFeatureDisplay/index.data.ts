import { VersionComparisonItem } from './index.type';

export const versionList: VersionComparisonItem[] = [
  {
    key: 'version_ce',
    color: 'green',
    type: 'common.version.ce',
    title: 'common.version.ceTitle',
    subtitle: 'common.version.ceSubTitle',
    buttonText: 'common.version.ceButtonText',
    termText: 'common.version.ceTerm',
    applyLink:
      'https://actiontech.github.io/sqle-docs/docs/deploy-manual/intro',
    contentDesc: 'common.version.ceDesc'
  },
  {
    key: 'version_demo',
    color: 'blue',
    type: 'common.version.demo',
    title: 'common.version.demoTitle',
    subtitle: 'common.version.demoSubTitle',
    buttonText: 'common.version.demoButtonText',
    termText: 'common.version.demoTerm',
    applyLink: 'https://www.actionsky.com/sqle?question=true',
    contentDesc: 'common.version.demoDesc'
  },
  {
    key: 'version_ee',
    color: 'orange',
    type: 'common.version.ee',
    title: 'common.version.eeTitle',
    subtitle: 'common.version.eeSubTitle',
    buttonText: 'common.version.eeButtonText',
    applyLink:
      'https://actiontech.github.io/sqle-docs/docs/support/commercial-support/',
    contentDesc: 'common.version.eeDesc'
  }
];
