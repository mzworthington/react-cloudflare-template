import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { loadHostingConfig } from './hostingConfig.ts';

describe('hosting config', () => {
  it('reads the Pages project and hostnames from committed yaml', () => {
    const hosting = loadHostingConfig(`pagesProjectName: yusur
pagesHostnames:
  - www.yusur.co.uk
  - yusur.co.uk
enableWebAnalytics: false
accountId: account
zoneId: zone
`);

    assert.deepEqual(hosting, {
      pagesProjectName: 'yusur',
      pagesHostnames: ['www.yusur.co.uk', 'yusur.co.uk'],
      enableWebAnalytics: false,
      accountId: 'account',
      zoneId: 'zone',
    });
  });

  it('reads the Cloudflare account and zone from committed yaml', () => {
    const hosting = loadHostingConfig(`pagesProjectName: yusur
pagesHostnames:
  - www.yusur.co.uk
enableWebAnalytics: false
accountId: fe0bb0a89551958509fe4d65883026cc
zoneId: 8fa428280586fdd39a02330d36ae0727
`);

    assert.equal(hosting.accountId, 'fe0bb0a89551958509fe4d65883026cc');
    assert.equal(hosting.zoneId, '8fa428280586fdd39a02330d36ae0727');
  });
});
