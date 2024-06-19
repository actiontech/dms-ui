import type { SVGProps } from 'react';
const ListLayoutOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      {...props}
    >
      <path d="M12.25 1.75c.322 0 .583.261.583.583v9.334a.583.583 0 0 1-.583.583H1.75a.583.583 0 0 1-.583-.583V2.333c0-.322.26-.583.583-.583zm-.583 1.167H2.333v8.166h9.334zM10.5 8.75v1.167h-7V8.75z" />
    </svg>
  );
};
export default ListLayoutOutlined;
