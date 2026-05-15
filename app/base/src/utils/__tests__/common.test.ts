import {
  getDbServiceIsConnectbale,
  getDBServiceConnectableErrorMessage
} from '../common';
import { ICheckDBServiceIsConnectableReplyItem } from '@actiontech/shared/lib/api/base/service/common';

describe('common utils', () => {
  describe('getDbServiceIsConnectbale', () => {
    it('should return true when all services are connectable', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        { component: 'mysql', is_connectable: true, connect_error_message: '' },
        {
          component: 'postgres',
          is_connectable: true,
          connect_error_message: ''
        }
      ];

      expect(getDbServiceIsConnectbale(connectableInfos)).toBe(true);
    });

    it('should return false when any service is not connectable', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        { component: 'mysql', is_connectable: true, connect_error_message: '' },
        {
          component: 'postgres',
          is_connectable: false,
          connect_error_message: 'Connection error'
        }
      ];

      expect(getDbServiceIsConnectbale(connectableInfos)).toBe(false);
    });

    it('should return false when all services are not connectable', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        {
          component: 'mysql',
          is_connectable: false,
          connect_error_message: 'Error 1'
        },
        {
          component: 'postgres',
          is_connectable: false,
          connect_error_message: 'Error 2'
        }
      ];

      expect(getDbServiceIsConnectbale(connectableInfos)).toBe(false);
    });

    it('should handle empty array', () => {
      expect(getDbServiceIsConnectbale([])).toBe(true);
    });

    it('should handle undefined or null is_connectable values', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        { component: 'mysql', is_connectable: true, connect_error_message: '' },
        {
          component: 'postgres',
          is_connectable: undefined as any,
          connect_error_message: ''
        }
      ];

      expect(getDbServiceIsConnectbale(connectableInfos)).toBe(false);
    });
  });

  describe('getDBServiceConnectableErrorMessage', () => {
    it('should return empty string when all services are connectable', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        { component: 'mysql', is_connectable: true, connect_error_message: '' },
        {
          component: 'postgres',
          is_connectable: true,
          connect_error_message: ''
        }
      ];

      expect(getDBServiceConnectableErrorMessage(connectableInfos)).toBe('');
    });

    it('should return formatted error message for non-connectable services', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        {
          component: 'mysql',
          is_connectable: false,
          connect_error_message: 'Connection error 1'
        },
        {
          component: 'postgres',
          is_connectable: true,
          connect_error_message: ''
        },
        {
          component: 'oracle',
          is_connectable: false,
          connect_error_message: 'Connection error 2'
        }
      ];

      expect(getDBServiceConnectableErrorMessage(connectableInfos)).toBe(
        'mysql: Connection error 1 \n\roracle: Connection error 2 '
      );
    });

    it('should handle newline characters at the end of error messages', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        {
          component: 'mysql',
          is_connectable: false,
          connect_error_message: 'Connection error 1\n'
        },
        {
          component: 'postgres',
          is_connectable: false,
          connect_error_message: 'Connection error 2\n'
        }
      ];

      expect(getDBServiceConnectableErrorMessage(connectableInfos)).toBe(
        'mysql: Connection error 1 \n\rpostgres: Connection error 2 '
      );
    });

    it('should handle empty array', () => {
      expect(getDBServiceConnectableErrorMessage([])).toBe('');
    });

    it('should handle undefined or null error messages', () => {
      const connectableInfos: ICheckDBServiceIsConnectableReplyItem[] = [
        {
          component: 'mysql',
          is_connectable: false,
          connect_error_message: undefined as any
        },
        {
          component: 'postgres',
          is_connectable: false,
          connect_error_message: null as any
        }
      ];

      expect(getDBServiceConnectableErrorMessage(connectableInfos)).toBe(
        'mysql: undefined \n\rpostgres: undefined '
      );
    });
  });
});
