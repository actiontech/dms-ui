import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const OrderStateBarStyleWrapper = styled('section')`
  &.order-state-bar-wrapper {
    width: 100%;
    height: 100%;

    &,
    .bar-wrapper,
    .bar-wrapper .bar,
    .legend-wrapper {
      width: 100%;
    }

    .bar-wrapper {
      height: 128px;
      display: flex;
      align-items: center;

      .bar {
        table.bar-line {
          &,
          tr,
          td {
            border: 0;
          }

          tr {
            height: 48px;
          }

          td {
            position: relative;
            z-index: 1;

            &::after {
              content: '';
              display: inline-block;
              width: 100%;
              height: 100%;
              position: absolute;
              z-index: 2;
              bottom: 0;
              left: 0;
              background-color: inherit;
              cursor: default;
            }

            &:first-of-type,
            &:first-of-type::after {
              border-radius: 4px 0 0 4px;
            }

            &:last-child,
            &:last-child::after {
              border-radius: 0 4px 4px 0;
            }

            &:hover {
              &::after {
                height: 60px;
                border-radius: 4px 4px 0 0;
                transition: all 0.4s;
              }
            }
          }
        }
      }
    }

    .legend-wrapper {
      height: calc(100% - 128px);
      padding-top: 10px;

      .state-item {
        position: relative;
        cursor: default;

        .line {
          position: relative;
          bottom: 0;
          width: 100%;
          height: 4px;
          border-radius: 4px;
        }

        .state-item-header {
          height: 20px;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
          font-size: 12px;
        }

        .state-item-cont {
          display: flex;
          align-items: center;
          line-height: 24px;
          padding-bottom: 12px;

          .num-val {
            font-style: normal;
            font-family: 'PlusJakartaSans Medium';
            font-size: 16px;
            font-weight: 700;
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
          }

          .rate-val {
            margin-left: 4px;
            font-size: 12px;
            font-weight: 600;
          }
        }
      }
    }
  }

  .order-state-popover {
    width: auto;
    min-width: 170px;
    padding: 0;

    .${ANTD_PREFIX_STR}-popover-inner {
      padding: 2px 12px;
    }
  }
`;
