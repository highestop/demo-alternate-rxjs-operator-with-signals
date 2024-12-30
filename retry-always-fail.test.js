import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { retryAsyncTask } from '.'

test('retry: always failed', async () => {
    const trace = vi.fn()
    const task = async (signal, index) => {
        await delay(100, { signal })
        trace(index)
        throw new Error('failed' + index)
    }

    const controller = new AbortController()
    const signal = controller.signal
    try {
        await retryAsyncTask(task, 3, signal)
    } catch (e) {
        expect(e.message).toBe('failed2')
        expect(trace).toBeCalledTimes(3)
        expect(trace).toHaveBeenNthCalledWith(1, 0)
        expect(trace).toHaveBeenNthCalledWith(2, 1)
        expect(trace).toHaveBeenNthCalledWith(3, 2)
    }
})
