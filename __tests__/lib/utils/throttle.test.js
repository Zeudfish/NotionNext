import throttle from '@/lib/utils/throttle'

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(1000)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('exposes a lodash-compatible cancel method', () => {
    const throttled = throttle(jest.fn(), 200)

    expect(typeof throttled.cancel).toBe('function')
  })

  it('cancels a pending trailing invocation and can be reused', () => {
    const callback = jest.fn()
    const throttled = throttle(callback, 200)

    throttled('first')
    expect(callback).toHaveBeenCalledWith('first')

    jest.advanceTimersByTime(50)
    throttled('pending')
    throttled.cancel()
    jest.advanceTimersByTime(200)

    expect(callback).toHaveBeenCalledTimes(1)

    throttled('after-cancel')
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith('after-cancel')
  })
})
