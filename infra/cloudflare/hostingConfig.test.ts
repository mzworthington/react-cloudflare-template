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
`);

    assert.deepEqual(hosting, {
      pagesProjectName: 'yusur',
      pagesHostnames: ['www.yusur.co.uk', 'yusur.co.uk'],
      enableWebAnalytics: false,
    });
  });
});
