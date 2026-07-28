export {};

declare global {
  interface Element {
    _grpBound?: boolean;
    _grpComposeObserver?: MutationObserver | null;
    _grpComposeRoot?: Element;
    _grpOriginalInlinePosition?: string;
    _grpReposition?: (() => void) | null;
    _grpResizeObserver?: ResizeObserver | null;
    _grpSetRelativePosition?: boolean;
  }

  interface Window {
    __gmailRecipientPreviewInitialized?: boolean;
  }
}
