import type { SVGProps } from 'react';
const EditFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M6.162 12.667H14V14H2v-2.829l6.6-6.6 2.828 2.83zm3.38-9.038 1.415-1.414a.667.667 0 0 1 .942 0L13.785 4.1a.667.667 0 0 1 0 .942l-1.414 1.414z" />
    </svg>
  );
};
export default EditFilled;
