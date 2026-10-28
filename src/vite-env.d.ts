/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public HTTPS endpoint that accepts a JSON POST from the inquiry forms.
   * PUBLIC — inlined into the client bundle. Never put a secret here.
   * Unset means the forms use the documented mailto fallback.
   */
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
