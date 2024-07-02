import type { SVGProps } from 'react';
const ProfileEditFilled = (props: SVGProps<SVGSVGElement>) => {
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
        d="M13.333 1.333c.368 0 .667.299.667.667v2.505l-6 6-.003 2.825 2.83.004L14 10.16V14a.667.667 0 0 1-.667.667H2.667A.667.667 0 0 1 2 14V2c0-.368.299-.667.667-.667zm1.186 4.539.942.943L10.276 12l-.944-.001.001-.942zM8 8H4.667v1.333H8zm2-2.667H4.667v1.334H10z"
      />
    </svg>
  );
};
export default ProfileEditFilled;
