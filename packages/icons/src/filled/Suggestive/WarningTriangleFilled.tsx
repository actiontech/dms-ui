import type { SVGProps } from 'react';
const WarningTriangleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <path d="m10.72 2.5 7.94 13.75a.833.833 0 0 1-.722 1.25H2.06a.833.833 0 0 1-.722-1.25L9.277 2.5a.833.833 0 0 1 1.444 0M9.167 13.333V15h1.666v-1.667zm0-5.833v4.167h1.666V7.5z" />
    </svg>
  );
};
export default WarningTriangleFilled;
