import type { SVGProps } from 'react';
const ProfileShieldFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="m9.75 8.58 3.405-.75 1.875.42v-6a.75.75 0 0 0-.75-.75H3a.75.75 0 0 0-.75.75v13.5a.75.75 0 0 0 .75.75h6.075a3.68 3.68 0 0 1-.825-2.332v-3.75a1.86 1.86 0 0 1 1.5-1.838m-1.5 1.155H6v-1.5h2.25zm-2.25-3v-1.5h5.25v1.5zm10.208 3.308-3.083-.683-3.082.683a.375.375 0 0 0-.293.367v3.75a2.25 2.25 0 0 0 1.005 1.875l2.37 1.582 2.37-1.582A2.25 2.25 0 0 0 16.5 14.16v-3.75a.375.375 0 0 0-.293-.367"
      />
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="m16.208 10.043-3.083-.683-3.082.683a.375.375 0 0 0-.293.367v3.75a2.25 2.25 0 0 0 1.005 1.875l2.37 1.583 2.37-1.583A2.25 2.25 0 0 0 16.5 14.16v-3.75a.375.375 0 0 0-.293-.367"
      />
    </svg>
  );
};
export default ProfileShieldFilled;
