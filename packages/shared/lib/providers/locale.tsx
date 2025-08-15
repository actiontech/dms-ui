import React, { ReactNode, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { createInstance, i18n as I18nInstance, Resource } from 'i18next';
import { SupportLanguage } from '../enum';
import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';
import { DEFAULT_LANGUAGE } from '../locale';

type PlainObject = Record<string, any>;

function isObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge<T extends PlainObject, U extends PlainObject>(
  target: T,
  source: U
): T & U {
  const output: PlainObject = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = (source as PlainObject)[key];
    const targetValue = (output as PlainObject)[key];
    if (isObject(sourceValue) && isObject(targetValue)) {
      (output as PlainObject)[key] = deepMerge(targetValue, sourceValue);
    } else {
      (output as PlainObject)[key] = sourceValue;
    }
  });
  return output as T & U;
}

export const defaultLocaleResources: Resource = {
  [SupportLanguage.zhCN]: zhCN,
  [SupportLanguage.enUS]: enUS
};

export type CreateKitI18nOptions = {
  language?: string;
  resources?: Resource;
  fallbackLng?: string;
  instance?: I18nInstance;
};

export function createKitI18n(
  options: CreateKitI18nOptions = {}
): I18nInstance {
  const {
    language = DEFAULT_LANGUAGE,
    resources = {},
    fallbackLng = SupportLanguage.zhCN,
    instance
  } = options;

  const i18n = instance ?? createInstance();

  // If instance is already initialized by host app, just inject resources
  if ((i18n as any).isInitialized) {
    const merged: Resource = deepMerge(
      deepMerge({}, defaultLocaleResources),
      resources
    );
    // Inject resources into the existing instance
    Object.keys(merged).forEach((lng) => {
      const res = merged[lng as keyof Resource] as any;
      Object.keys(res).forEach((ns) => {
        i18n.addResourceBundle(lng, ns, res[ns], true, true);
      });
    });
    if (language) {
      i18n.changeLanguage(language);
    }
    return i18n;
  }

  const mergedResources: Resource = deepMerge(
    deepMerge({}, defaultLocaleResources),
    resources
  );

  i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng,
    resources: mergedResources,
    interpolation: { escapeValue: false },
    defaultNS: 'translation'
  });

  return i18n;
}

export interface LocaleProviderProps {
  children: ReactNode;
  i18n?: I18nInstance;
  language?: string;
  resources?: Resource;
  fallbackLng?: string;
  injectDefaultResources?: boolean;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  i18n,
  language = DEFAULT_LANGUAGE,
  resources = {},
  fallbackLng = SupportLanguage.zhCN,
  injectDefaultResources = true
}) => {
  const i18nInstance = useMemo(() => {
    if (i18n) {
      const toUse = i18n;
      if (injectDefaultResources) {
        const merged: Resource = deepMerge(
          deepMerge({}, defaultLocaleResources),
          resources
        );
        Object.keys(merged).forEach((lng) => {
          const res = merged[lng as keyof Resource] as any;
          Object.keys(res).forEach((ns) => {
            toUse.addResourceBundle(lng, ns, res[ns], true, true);
          });
        });
      } else if (Object.keys(resources).length > 0) {
        Object.keys(resources).forEach((lng) => {
          const res = (resources as any)[lng];
          Object.keys(res).forEach((ns) => {
            toUse.addResourceBundle(lng, ns, res[ns], true, true);
          });
        });
      }
      if (language) {
        toUse.changeLanguage(language);
      }
      return toUse;
    }

    return createKitI18n({ language, resources, fallbackLng });
  }, [i18n, language, resources, fallbackLng, injectDefaultResources]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};
