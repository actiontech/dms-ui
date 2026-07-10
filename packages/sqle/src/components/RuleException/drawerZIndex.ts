/** Drawer z-index when stacking above another drawer (e.g. audit result drawer). */
export const RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX = 1100;

/** Ant Design default popup base; used when drawer does not override z-index. */
export const ANT_DESIGN_Z_INDEX_POPUP_BASE = 1000;

/** Popup base z-index inside overlay drawers; must be >= drawer z-index. */
export const RULE_EXCEPTION_POPUP_Z_INDEX_BASE =
  RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX;

/** Nested modal (e.g. SQL fingerprint editor) above overlay drawer. */
export const RULE_EXCEPTION_NESTED_MODAL_Z_INDEX =
  RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX + 10;

export const getRuleExceptionOverlayPopupTheme = (drawerZIndex: number) => ({
  token: {
    zIndexPopupBase: drawerZIndex
  }
});
