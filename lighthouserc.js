const targetUrl = process.env.LHCI_URL
const collect = {
  url: [targetUrl || 'http://localhost:3000'],
  numberOfRuns: 3,
  settings: {
    preset: 'desktop',
    chromeFlags: '--no-sandbox --headless --disable-dev-shm-usage',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  }
}

if (!targetUrl) {
  collect.startServerCommand = 'npm start'
  collect.startServerReadyPattern = 'ready|Ready|Local:'
  collect.startServerReadyTimeout = 120000
}

module.exports = {
  ci: {
    collect,
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 350 }],
        interactive: ['warn', { maxNumericValue: 3500 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
