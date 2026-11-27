export interface HostingConfig {
  pagesProjectName: string;
  pagesHostnames: string[];
  enableWebAnalytics: boolean;
  accountId: string;
  zoneId: string;
}

/** Pages identity plus the Cloudflare account and zone. Tokens stay in the secret store. */
export function loadHostingConfig(source: string): HostingConfig {
  let pagesProjectName = '';
  const pagesHostnames: string[] = [];
  let enableWebAnalytics: boolean | undefined;
  let accountId = '';
  let zoneId = '';
  let inHostnames = false;

  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;

    if (line.startsWith('pagesHostnames:')) {
      inHostnames = true;
      continue;
    }
    if (inHostnames && line.startsWith('- ')) {
      pagesHostnames.push(unquote(line.slice(2).trim()));
      continue;
    }
    inHostnames = false;

    const sep = line.indexOf(':');
    if (sep === -1) throw new Error(`Invalid hosting.yaml line: ${line}`);
    const key = line.slice(0, sep).trim();
    const value = unquote(line.slice(sep + 1).trim());
    if (key === 'pagesProjectName') {
      pagesProjectName = value;
    } else if (key === 'accountId') {
      accountId = value;
    } else if (key === 'zoneId') {
      zoneId = value;
    } else if (key === 'enableWebAnalytics') {
      if (value !== 'true' && value !== 'false') {
        throw new Error('enableWebAnalytics must be true or false');
      }
      enableWebAnalytics = value === 'true';
    } else {
      throw new Error(`Unknown hosting.yaml key: ${key}`);
    }
  }

  if (pagesProjectName === '') throw new Error('hosting.yaml pagesProjectName is required');
  if (pagesHostnames.length === 0) throw new Error('hosting.yaml pagesHostnames is required');
  if (enableWebAnalytics === undefined) {
    throw new Error('hosting.yaml enableWebAnalytics is required');
  }
  if (accountId === '') throw new Error('hosting.yaml accountId is required');
  if (zoneId === '') throw new Error('hosting.yaml zoneId is required');

  return { pagesProjectName, pagesHostnames, enableWebAnalytics, accountId, zoneId };
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
