import { config, homepage } from "../../package.json"
import { getString } from "../utils/locale"
import { PROVIDERS, getProviderBaseUrl, getProviderModels } from "../config/providers"
import { setPref } from "../utils/prefs"

export function registerPrefs() {
  Zotero.PreferencePanes.register({
    pluginID: config.addonID,
    src: rootURI + "chrome/content/preferences.xhtml",
    label: getString("prefs-title"),
    image: `chrome://${config.addonRef}/content/icons/favicon@0.333x.png`,
    helpURL: homepage,
  })
}

export function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
    }
  } else {
    addon.data.prefs.window = _window
  }
  updatePrefsUI()
  bindPrefEvents()
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer()
  // const tableHelper = new ztoolkit.VirtualizedTable(addon.data.prefs?.window!)
  //   .setContainerId(`${config.addonRef}-table-container`)
  //   .setProp({
  //     id: `${config.addonRef}-prefs-table`,
  //     // Do not use setLocale, as it modifies the Zotero.Intl.strings
  //     // Set locales directly to columns
  //     columns: addon.data.prefs?.columns.map(column =>
  //       Object.assign(column, {
  //         label: getString(column.label) || column.label,
  //       })
  //     ),
  //     showHeader: true,
  //     multiSelect: true,
  //     staticColumns: true,
  //     disableFontSizeScaling: true,
  //   })
  //   .setProp('getRowCount', () => addon.data.prefs?.rows.length || 0)
  //   .setProp(
  //     'getRowData',
  //     index =>
  //       addon.data.prefs?.rows[index] || {
  //         title: 'no data',
  //         detail: 'no data',
  //       }
  //   )
  //   // Show a progress window when selection changes
  //   .setProp('onSelectionChange', selection => {
  //     new ztoolkit.ProgressWindow(config.addonName)
  //       .createLine({
  //         text: `Selected line: ${addon.data.prefs?.rows
  //           .filter((v, i) => selection.isSelected(i))
  //           .map(row => row.title)
  //           .join(',')}`,
  //         progress: 100,
  //       })
  //       .show()
  //   })
  //   // When pressing delete, delete selected line and refresh table.
  //   // Returning false to prevent default event.
  //   .setProp('onKeyDown', (event: KeyboardEvent) => {
  //     if (event.key == 'Delete' || (Zotero.isMac && event.key == 'Backspace')) {
  //       addon.data.prefs!.rows =
  //         addon.data.prefs?.rows.filter((v, i) => !tableHelper.treeInstance.selection.isSelected(i)) || []
  //       tableHelper.render()
  //       return false
  //     }
  //     return true
  //   })
  //   // For find-as-you-type
  //   .setProp('getRowString', index => addon.data.prefs?.rows[index].title || '')
  //   // Render the table.
  //   .render(-1, () => {
  //     renderLock.resolve()
  //   })
  await renderLock.promise
  ztoolkit.log("Preference table rendered!")
}

function bindPrefEvents() {
  const doc = addon.data.prefs!!.window.document

  // Provider dropdown change handler
  const providerDropdown = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-PROVIDER`,
  ) as XUL.MenuList

  // Initialize popular models dropdown based on current provider
  const currentProvider = Zotero.Prefs.get(`${config.addonRef}.PROVIDER`) as string || 'openai'
  updatePopularModelsDropdown(currentProvider)

  providerDropdown?.addEventListener("command", (e) => {
    const selectedProvider = (e.target as XUL.MenuList).value
    const baseUrl = getProviderBaseUrl(selectedProvider)

    // Auto-update base URL
    if (baseUrl) {
      const baseUrlInput = doc.querySelector(
        `#zotero-prefpane-${config.addonRef}-OPENAI_BASE_URL`,
      ) as HTMLInputElement
      if (baseUrlInput) {
        baseUrlInput.value = baseUrl
        setPref("OPENAI_BASE_URL", baseUrl)
      }
    }

    // Update popular models dropdown
    updatePopularModelsDropdown(selectedProvider)

    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new provider settings to take effect.`,
    )
  })

  // Popular models dropdown change handler
  const popularModelsDropdown = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-POPULAR_MODELS`,
  ) as XUL.MenuList

  popularModelsDropdown?.addEventListener("command", (e) => {
    const selectedModel = (e.target as XUL.MenuList).value
    if (selectedModel) {
      const modelInput = doc.querySelector(
        `#zotero-prefpane-${config.addonRef}-OPENAI_MODEL`,
      ) as HTMLInputElement
      if (modelInput) {
        modelInput.value = selectedModel
        setPref("OPENAI_MODEL", selectedModel)
      }
      addon.data.prefs!.window.alert(
        `Please restart Zotero for your new model to take effect.`,
      )
    }
  })

  // Model text input change handler
  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-OPENAI_MODEL`,
  )?.addEventListener("change", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new model to take effect.`,
    )
  })

  // Base URL change handler
  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-OPENAI_BASE_URL`,
  )?.addEventListener("change", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new base URL to take effect.`,
    )
  })

  // API Key change handler
  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-OPENAI_API_KEY`,
  )?.addEventListener("change", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new API key to take effect.`,
    )
  })

  // Shortcut modifier handlers
  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-SHORTCUT_MODIFIER-shift`,
  )?.addEventListener("command", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new shortcut combo to take effect.`,
    )
  })

  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-SHORTCUT_MODIFIER-ctrl-shift`,
  )?.addEventListener("command", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new shortcut combo to take effect.`,
    )
  })

  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-SHORTCUT_MODIFIER-alt-shift`,
  )?.addEventListener("command", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new shortcut combo to take effect.`,
    )
  })

  // Shortcut key handler
  doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-SHORTCUT_KEY`,
  )?.addEventListener("change", (e) => {
    addon.data.prefs!.window.alert(
      `Please restart Zotero for your new shortcut combo to take effect.`,
    )
  })
}

function updatePopularModelsDropdown(provider: string) {
  const doc = addon.data.prefs!!.window.document
  const popularModelsPopup = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-POPULAR_MODELS-popup`,
  ) as XUL.MenuPopup

  if (!popularModelsPopup) return

  // Clear existing items except the first placeholder
  while (popularModelsPopup.childNodes.length > 1) {
    popularModelsPopup.removeChild(popularModelsPopup.lastChild!)
  }

  // Add popular models for the selected provider
  const models = getProviderModels(provider)
  models.forEach((model) => {
    const menuitem = doc.createXULElement("menuitem")
    menuitem.setAttribute("label", model)
    menuitem.setAttribute("value", model)
    popularModelsPopup.appendChild(menuitem)
  })
}
