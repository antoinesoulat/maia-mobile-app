import { NativeModules, Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

function getNativeBundleHost() {
  const scriptUrl = NativeModules.SourceCode?.scriptURL || '';
  const hostMatch = scriptUrl.match(/^https?:\/\/([^/:]+)/);

  return hostMatch?.[1] || '';
}

function getWebHost() {
  if (typeof window === 'undefined') {
    return '';
  }

  const { hostname } = window.location;

  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }

  return hostname;
}

function resolveApiUrl() {
  if (Platform.OS === 'web') {
    const webHost = getWebHost();

    if (!webHost) {
      return configuredApiUrl;
    }

    return configuredApiUrl.replace('localhost', webHost).replace('127.0.0.1', webHost);
  }

  const bundleHost = getNativeBundleHost();

  if (!bundleHost) {
    return configuredApiUrl;
  }

  return configuredApiUrl.replace('localhost', bundleHost).replace('127.0.0.1', bundleHost);
}

export const API_URL = resolveApiUrl();
