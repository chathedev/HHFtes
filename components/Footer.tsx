//
// Wrapper that re-exports the real footer component with correct casing.
// This prevents case-sensitive import errors in production builds.
//
export { default } from "./footer"
export { default as Footer } from "./footer"
