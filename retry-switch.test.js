import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { retryAsyncTask } from '.'

test('retry works', async () => {
    const trace = vi.fn()

    const task = async (signal, index) => {
        await delay(100, { signal })
        trace(index)
        return 'success'
    }

    const controller = new AbortController()
    const signal = controller.signal
    const res = await retryAsyncTask(task, 3, signal)

    expect(res).toBe('success')
    expect(trace).toBeCalledTimes(1)
    expect(trace).toBeCalledWith(0)
})
