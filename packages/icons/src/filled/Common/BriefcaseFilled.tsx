import type { SVGProps } from 'react';
const BriefcaseFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 28"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M4 3.333v5.334h16V3.333h2.675c.732 0 1.325.594 1.325 1.325v21.35c0 .732-.593 1.325-1.325 1.325H1.325A1.325 1.325 0 0 1 0 26.01V4.658c0-.732.593-1.325 1.325-1.325zm4 17.334H5.333v2.666H8zm0-4H5.333v2.666H8zm0-4H5.333v2.666H8zm9.333-12V6H6.667V.667z"
      />
    </svg>
  );
};
export default BriefcaseFilled;
