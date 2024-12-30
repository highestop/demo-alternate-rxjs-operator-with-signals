import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { createDebouncedAsyncTask } from '.'

test('debounce + switch: debounce works', async () => {
    const trace = vi.fn()
    const traceStart = vi.fn()
    const traceAbort = vi.fn()

    const task = async (signal, params) => {
        try {
            traceStart(params)
            await delay(100, { signal })
            trace(params)
        } catch (e) {
            traceAbort(e)
        }
    }

    const controller = new AbortController()
    const signal = controller.signal
    const debouncedHandleChange = createDebouncedAsyncTask(signal, task, 500)

    // handle changes
    debouncedHandleChange(1)
    debouncedHandleChange(2)
    debouncedHandleChange(3)

    await delay(605)

    // task should run once, with last param
    expect(traceStart).toBeCalledTimes(1)
    expect(traceStart).toBeCalledWith(3)
    expect(trace).toBeCalledTimes(1)
    expect(trace).toBeCalledWith(3)
    expect(traceAbort).not.toBeCalled()

    // handle changes again
    debouncedHandleChange(4)
    debouncedHandleChange(5)

    await delay(605)

    // task should run once agian, with last param
    expect(traceStart).toBeCalledTimes(2)
    expect(traceStart).toHaveBeenLastCalledWith(5)
    expect(trace).toBeCalledTimes(2)
    expect(trace).toHaveBeenLastCalledWith(5)
    expect(traceAbort).not.toBeCalled()
})
