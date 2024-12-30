import { debounce } from 'lodash'
import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'

test('debounce', async () => {
    const trace = vi.fn()
    const debouceTrace = debounce(trace, 100)

    debouceTrace(1)
    await delay(10)
    expect(trace).not.toBeCalled()

    debouceTrace(2)
    await delay(10)
    expect(trace).not.toBeCalled()

    debouceTrace(3)
    await delay(10)
    expect(trace).not.toBeCalled()

    await delay(200)
    expect(trace).toHaveBeenCalledTimes(1)
    expect(trace).toBeCalledWith(3)
})
