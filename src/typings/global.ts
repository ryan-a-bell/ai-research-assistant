declare global {
  const __env__: "production" | "development"
  const _globalThis: {
    [key: string]: any
    Zotero: _ZoteroTypes.Zotero
    // ZoteroPane: _ZoteroTypes.ZoteroPane;
    // window: Window;
    // document: Document;
    ztoolkit: ZToolkit
    addon: typeof addon
  }
  type ZToolkit = import("../settings/addon").CustomToolkit
  const ztoolkit: ZToolkit
  const rootURI: string
  const addon: import("../settings/addon").default
}

// Extend Zotero namespace with missing APIs
declare namespace Zotero {
  namespace Styles {
    function get(style: string): {
      getCiteProc(): {
        updateItems(itemIds: number[]): void
        makeBibliography(): [any, string[]]
      }
    }
  }

  namespace Item {
    // Add Item namespace if needed
  }
}

import type { nsXPCComponents_Classes as _nsXPCComponents_Classes } from "zotero-types/types/gecko/lib.gecko.tweaks"

export type nsXPCComponents_Classes = _nsXPCComponents_Classes
