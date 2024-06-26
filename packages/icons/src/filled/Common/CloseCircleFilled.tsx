import type { SVGProps } from 'react';
const CloseCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#F66074'}
        d="M8 14.666A6.666 6.666 0 1 1 8 1.333a6.666 6.666 0 0 1 0 13.333m0-7.609L6.115 5.171l-.944.943L7.057 8 5.171 9.885l.944.943L8 8.942l1.885 1.886.944-.943L8.943 8l1.886-1.886-.944-.943z"
      />
    </svg>
  );
};
export default CloseCircleFilled;
