describe('cache_manager build cache reads', () => {
  const originalLifecycle = process.env.npm_lifecycle_event

  afterEach(() => {
    jest.resetModules()
    if (originalLifecycle === undefined) {
      delete process.env.npm_lifecycle_event
    } else {
      process.env.npm_lifecycle_event = originalLifecycle
    }
  })

  it('keeps cache reads enabled during build even when runtime cache is disabled', async () => {
    process.env.npm_lifecycle_event = 'build'
    const { cacheReadsEnabled } = await import('@/lib/cache/cache_manager')

    expect(cacheReadsEnabled()).toBe(true)
  })
})
