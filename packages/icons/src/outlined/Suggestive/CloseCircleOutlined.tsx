import type { SVGProps } from 'react';
const CloseCircleOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#F66074"
        d="M8 14.667A6.666 6.666 0 1 1 8 1.334a6.666 6.666 0 0 1 0 13.333m0-1.334A5.333 5.333 0 1 0 8 2.667a5.333 5.333 0 0 0 0 10.666m0-6.276 1.885-1.886.944.944L8.943 8l1.886 1.885-.944.944L8 8.943l-1.885 1.886-.944-.944L7.057 8 5.171 6.115l.944-.944z"
      />
    </svg>
  );
};
export default CloseCircleOutlined;
