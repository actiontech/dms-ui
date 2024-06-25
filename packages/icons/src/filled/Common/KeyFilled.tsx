import type { SVGProps } from 'react';
const KeyFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="M9.494 10.5h3.256v3h3v-3h1.5v-3H9.494z"
      />
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M5.25 13.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m0-3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
      />
    </svg>
  );
};
export default KeyFilled;
