import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import * as cloudflare from '@pulumi/cloudflare';

import { loadHostingConfig } from './hostingConfig';

const hosting = loadHostingConfig(readFileSync(join(__dirname, 'hosting.yaml'), 'utf8'));
const accountId = hosting.accountId;
const zoneId = hosting.zoneId;
const pagesProjectName = hosting.pagesProjectName;
/** Zone RUM is shared; only enable when this stack owns the zone's analytics site. */
const enableWebAnalytics = hosting.enableWebAnalytics;
const pagesHostnames = hosting.pagesHostnames;

const pagesProject = new cloudflare.PagesProject('site', {
  accountId,
  name: pagesProjectName,
  productionBranch: 'main',
});

for (const hostname of pagesHostnames) {
  const safe = hostname.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dns = new cloudflare.DnsRecord(
    `pages-dns-${safe}`,
    {
      zoneId,
      name: hostname,
      type: 'CNAME',
      content: pagesProject.subdomain,
      proxied: true,
      ttl: 1,
      comment: 'Cloudflare Pages',
    },
    { deleteBeforeReplace: true },
  );

  new cloudflare.PagesDomain(
    `pages-domain-${safe}`,
    {
      accountId,
      projectName: pagesProject.name,
      name: hostname,
    },
    { dependsOn: [dns] },
  );

  new cloudflare.ObservatoryScheduledTest(`observatory-${safe}`, {
    zoneId,
    url: hostname,
  });
}

const zone = cloudflare.getZoneOutput({ zoneId });

/** Zone-owner RUM only. Shared-zone hosts reuse the apex `autoInstall` site. */
const webAnalytics = enableWebAnalytics
  ? new cloudflare.WebAnalyticsSite('web-analytics', {
      accountId,
      zoneTag: zoneId,
      autoInstall: true,
      enabled: true,
    })
  : undefined;

export const pagesProjectNameOut = pagesProject.name;
export const pagesSubdomain = pagesProject.subdomain;
export const pagesHostnamesOut = pagesHostnames;
export const zoneName = zone.name;
/** Present only when `enableWebAnalytics` is true. */
export const webAnalyticsSiteTag = webAnalytics?.siteTag ?? null;
export const webAnalyticsSiteToken = webAnalytics?.siteToken ?? null;
