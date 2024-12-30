import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { createDebouncedAsyncTask } from '.'

test('debounce + switchMap: cancel works', async () => {
    const trace = vi.fn()
    const traceAbort = vi.fn()

    const task = async (signal, params) => {
        try {
            await delay(100, { signal })
            trace(params)
        } catch (e) {
            traceAbort(e)
        }
    }

    const controller = new AbortController()
    const signal = controller.signal
    const debouncedHandleChange = createDebouncedAsyncTask(signal, task, 500)

    debouncedHandleChange(1)
    await delay(400)
    controller.abort()

    await delay(800)
    expect(trace).not.toBeCalled()
    expect(traceAbort).not.toBeCalled()
})
