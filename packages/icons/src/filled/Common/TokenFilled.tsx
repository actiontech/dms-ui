import type { SVGProps } from 'react';
const TokenFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M11.333 9.333H8.44A4.002 4.002 0 0 1 .667 8a4 4 0 0 1 7.772-1.333h6.894v2.666H14V12h-2.667zm-6.666 0a1.333 1.333 0 1 0 0-2.666 1.333 1.333 0 0 0 0 2.666" />
    </svg>
  );
};
export default TokenFilled;
