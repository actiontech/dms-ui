/**
 * background: '#ffffff'
 */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { message, Segmented } from 'antd';
import * as ActiontechIcons from '../../src';

const Container = styled('div')`
  display: flex;
  flex-flow: row wrap;
  margin: auto;
`;

const Card = styled('div')`
  height: 90px;
  padding: 12px 0;
  border-radius: 8px;
  margin: 12px 0 16px;
  width: 20%;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #1677ff;
    color: white;
  }
`;

const NameDescription = styled('p')`
  display: block;
  text-align: center;
  transform: scale(0.83);
  font-family: 'Lucida Console', Consolas;
  white-space: nowrap;
`;

const allIcons: {
  [key: string]: any;
} = ActiontechIcons;

const AllIconDemo = () => {
  const [currentTheme, setCurrentTheme] = React.useState('Outlined');

  const [messageApi, contextHolder] = message.useMessage();

  const visibleIconList = React.useMemo(
    () =>
      Object.keys(allIcons).filter((iconName) =>
        iconName.includes(currentTheme)
      ),
    [currentTheme]
  );

  const onCopy = (name: string) => {
    if (navigator.clipboard) {
      const text = `<${name} />`;
      navigator.clipboard.writeText(text);
      messageApi.success(`${text} copied`);
    }
  };

  return (
    <div style={{ color: '#555' }}>
      {contextHolder}
      <div style={{ textAlign: 'center' }}>
        <Segmented
          options={['Filled', 'Outlined']}
          value={currentTheme}
          onChange={(value) => {
            setCurrentTheme(value as string);
          }}
        />
      </div>
      <Container>
        {visibleIconList.map((iconName) => {
          const Component = allIcons[iconName];
          return (
            <Card key={iconName} onClick={() => onCopy(iconName)}>
              <Component width={32} height={32} />
              <NameDescription>{iconName}</NameDescription>
            </Card>
          );
        })}
      </Container>
    </div>
  );
};

export default AllIconDemo;
