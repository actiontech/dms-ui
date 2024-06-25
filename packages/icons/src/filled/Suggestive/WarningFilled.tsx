import type { SVGProps } from 'react';
const WarningFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#EBAD1C'}
        d="m8.577 2 6.35 11a.667.667 0 0 1-.577 1H1.648a.667.667 0 0 1-.577-1l6.35-11a.667.667 0 0 1 1.156 0m-1.244 8.667V12h1.333v-1.333zm0-4.667v3.334h1.333V6z"
      />
    </svg>
  );
};
export default WarningFilled;
