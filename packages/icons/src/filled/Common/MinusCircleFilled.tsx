import type { SVGProps } from 'react';
const MinusCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path d="M9 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15M5.25 8.25v1.5h7.5v-1.5z" />
    </svg>
  );
};
export default MinusCircleFilled;
