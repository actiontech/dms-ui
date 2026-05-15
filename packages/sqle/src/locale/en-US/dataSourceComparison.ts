// Only the keys that participate in cross-locale switching are translated
// here; other dataSourceComparison keys fall back to zh-CN via i18next's
// per-key fallback (fallbackLng = zh-CN). The drop-create warning banner
// MUST display in the user's selected language because it surfaces data
// loss risk; relying on zh-CN fallback would defeat the i18n contract.
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  entry: {
    modifiedSqlDrawer: {
      dropCreateWarningBanner:
        'Modify SQL contains destructive operations. Please review before execution.',
      dropCreateWarningTable:
        'Data loss risk; table will be dropped and recreated.',
      dropCreateWarningView:
        'View will be recreated; downstream queries depending on this view may be affected.'
    }
  }
};
