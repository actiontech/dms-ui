import { createContext, useContext } from 'react';

export interface ILoginConnectionContext {
  isOAuthEnabled: boolean;
  isLDAPEnabled: boolean;
  setOAuthEnabled: (enabled: boolean) => void;
  setLDAPEnabled: (enabled: boolean) => void;
}

export const LoginConnectionContext = createContext<ILoginConnectionContext>({
  isOAuthEnabled: false,
  isLDAPEnabled: false,
  setOAuthEnabled: () => void 0,
  setLDAPEnabled: () => void 0
});

export const useLoginConnectionContext = () =>
  useContext(LoginConnectionContext);
