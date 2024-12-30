import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { createDebouncedAsyncTask } from '.'

test('debounce + switch: switch works', async () => {
    const trace = vi.fn()
    const traceStart = vi.fn()
    const traceAbort = vi.fn()

    const task = async (signal, params) => {
        try {
            traceStart(params)
            await delay(500, { signal })
            trace(params)
        } catch (e) {
            traceAbort(e)
        }
    }

    const controller = new AbortController()
    const signal = controller.signal
    const debouncedHandleChange = createDebouncedAsyncTask(signal, task, 100)

    debouncedHandleChange(1)
    await delay(200)

    expect(traceStart).toBeCalledTimes(1)
    expect(traceStart).toHaveBeenLastCalledWith(1)
    expect(trace).not.toBeCalled()

    debouncedHandleChange(2)
    await delay(200)

    expect(traceStart).toBeCalledTimes(2)
    expect(traceStart).toHaveBeenLastCalledWith(2)
    expect(trace).not.toBeCalled()

    debouncedHandleChange(3)
    await delay(200)

    expect(traceStart).toBeCalledTimes(3)
    expect(traceStart).toHaveBeenLastCalledWith(3)
    expect(trace).not.toBeCalled()

    // a bit longer than the last handle change
    await delay(410)

    expect(trace).toBeCalledTimes(1)
    expect(trace).toBeCalledWith(3)
    expect(traceAbort).toBeCalledTimes(2)
})
