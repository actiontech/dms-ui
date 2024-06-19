import type { SVGProps } from 'react';
const FileUploadFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path d="m12 1.5 3.75 3.75v10.506a.745.745 0 0 1-.745.744H2.995a.75.75 0 0 1-.745-.744V2.244c0-.411.334-.744.745-.744zM9.75 9H12L9 6 6 9h2.25v3h1.5z" />
    </svg>
  );
};
export default FileUploadFilled;
