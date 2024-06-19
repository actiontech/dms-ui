import type { SVGProps } from 'react';
const DownTriangleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 6"
      width={16}
      height={16}
      {...props}
    >
      <path d="m1 1 8 4 8-4" />
    </svg>
  );
};
export default DownTriangleFilled;
