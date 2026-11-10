export const environment = {
  production: false,
  // The public site and ERP backend share a host; keep the configured backend port.
  apiUrl: typeof location === 'undefined'
    ? 'http://localhost:8080'
    : `${location.protocol}//${location.hostname.includes(':') ? `[${location.hostname.replace(/^\[|\]$/g, '')}]` : location.hostname}:8080`,
};
