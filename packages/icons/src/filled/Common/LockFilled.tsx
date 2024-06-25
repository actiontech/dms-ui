import type { SVGProps } from 'react';
const LockFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#C3C6CD"
        d="M13.5 6H15a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75v-9A.75.75 0 0 1 3 6h1.5v-.75a4.5 4.5 0 0 1 9 0zM12 6v-.75a3 3 0 0 0-6 0V6zm-3.75 4.5V12h1.5v-1.5zm-3 0V12h1.5v-1.5zm6 0V12h1.5v-1.5z"
      />
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="M12 6v-.75a3 3 0 1 0-6 0V6H4.5v-.75a4.5 4.5 0 0 1 9 0V6z"
      />
    </svg>
  );
};
export default LockFilled;
