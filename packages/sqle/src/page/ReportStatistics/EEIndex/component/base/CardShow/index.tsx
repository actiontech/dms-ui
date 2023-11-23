import { ReactNode } from 'react';
import { CardProps, Statistic, ConfigProvider } from 'antd';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import { CardShowStyleWrapper } from './style';

interface ICardShowProps extends CardProps {
  titleCont: string | ReactNode;
  numberCont: string | number | ReactNode;
  noteCont: string | ReactNode;
  extraIcon?: ReactNode;
}

const defaultNumber = 0;

const CardShow = (props: ICardShowProps) => {
  const { titleCont, extraIcon, numberCont, noteCont } = props;
  const { sqleTheme } = useThemeStyleData();

  return (
    <ConfigProvider
      theme={{
        components: {
          Statistic: {
            contentFontSize: sqleTheme.reportStatistics.cardShow.contentFontSize
          }
        }
      }}
    >
      <CardShowStyleWrapper hoverable bordered={false}>
        <header className="card-title">
          <span className="title-cont">{titleCont}</span>
          <span className="title-extra">{extraIcon ?? null}</span>
        </header>
        <section className="card-cont">
          <div className="number-cont">
            {typeof numberCont === 'number' ? (
              <Statistic
                value={numberCont ?? defaultNumber}
                valueStyle={{
                  fontWeight:
                    sqleTheme.reportStatistics.cardShow.contentFontWeight,
                  height: '40px',
                  lineHeight: '40px',
                  color: sqleTheme.reportStatistics.cardShow.numberContColor
                }}
              />
            ) : (
              numberCont ?? defaultNumber
            )}
          </div>
          <div className="note-cont">{noteCont}</div>
        </section>
      </CardShowStyleWrapper>
    </ConfigProvider>
  );
};

export default CardShow;
