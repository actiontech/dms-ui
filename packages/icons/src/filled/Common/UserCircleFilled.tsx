import type { SVGProps } from 'react';
const UserCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M8 1.333A6.67 6.67 0 0 1 14.666 8 6.67 6.67 0 0 1 8 14.667 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333m-3.985 8.944c.979 1.46 2.448 2.39 4.091 2.39s3.113-.93 4.091-2.39a5.98 5.98 0 0 0-4.09-1.61 5.98 5.98 0 0 0-4.092 1.61M8 7.333a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      />
    </svg>
  );
};
export default UserCircleFilled;
