import type { SVGProps } from 'react';
const FlagFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#EBAD1C'}
        d="M2.25 2.25h7.037a.75.75 0 0 1 .67.415L10.5 3.75H15a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75h-4.786a.75.75 0 0 1-.671-.415L9 12H3.75v4.5h-1.5z"
      />
    </svg>
  );
};
export default FlagFilled;
