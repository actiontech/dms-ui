import type { SVGProps } from 'react';
const ProfileSquareFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 19"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M15 17H3a.75.75 0 0 1-.75-.75V2.75A.75.75 0 0 1 3 2h12a.75.75 0 0 1 .75.75v13.5A.75.75 0 0 1 15 17M6 5.75v1.5h6v-1.5zm0 3v1.5h6v-1.5zm0 3v1.5h3.75v-1.5z"
      />
    </svg>
  );
};
export default ProfileSquareFilled;
