// /* eslint-disable */
const template = (variables, { tpl }) => {
  const componentName = variables.componentName.replace('Svg', '');

  return tpl`
${variables.imports};

${variables.interfaces};


const ${componentName} = (${variables.props}) => {
  return (
   ${variables.jsx}
  );
};


export default ${componentName};
`;
};

module.exports = template;
