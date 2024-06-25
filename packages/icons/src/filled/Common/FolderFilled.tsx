import type { SVGProps } from 'react';
const FolderFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#4583FF'}
        d="M165.3 417.3V739c0 22.2 19 40.3 42.4 40.3H815c23.4 0 42.4-18 42.4-40.3V412h-692v5.3zM815 278.6H519.5v-8.8c0-28.5-23.7-51.6-52.7-51.6H218c-29 0-52.7 23.1-52.7 51.6V368h692.1v-49.1c0-22.3-19-40.3-42.4-40.3m0 0"
      />
    </svg>
  );
};
export default FolderFilled;
