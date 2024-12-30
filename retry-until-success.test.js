import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { retryAsyncTask } from '.'

test('retry: failed failed success', async () => {
    const trace = vi.fn()

    const task = async (signal, index) => {
        await delay(100, { signal })
        trace(index)
        if (index < 2) {
            throw new Error('failed' + index)
        } else {
            return 'success'
        }
    }

    const controller = new AbortController()
    const signal = controller.signal
    const res = await retryAsyncTask(task, 3, signal)

    expect(res).toBe('success')
    expect(trace).toBeCalledTimes(3)
    expect(trace).toHaveBeenNthCalledWith(1, 0)
    expect(trace).toHaveBeenNthCalledWith(2, 1)
    expect(trace).toHaveBeenNthCalledWith(3, 2)
})
