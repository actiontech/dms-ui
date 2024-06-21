import type { SVGProps } from 'react';
const SignalFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#C3C6CD"
        d="M2 8h2.667v6H2zm9.333-2.667H14V14h-2.667zm-4.666-4h2.666V14H6.667z"
      />
    </svg>
  );
};
export default SignalFilled;
