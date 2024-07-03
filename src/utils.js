// utils.js
export function getSubdomain(host) {
    const parts = host.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return '';
  }
  