import { delay } from 'signal-timers'
import { test, expect, vi } from 'vitest'
import { createAsyncTask } from '.'

test('switch: switch works', async () => {
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
    const handleChange = createAsyncTask(signal, task)

    handleChange(1)
    handleChange(2)
    handleChange(3)

    await delay(110)

    expect(traceAbort).toHaveBeenCalledTimes(2)
    expect(trace).toHaveBeenCalledTimes(1)
    expect(trace).toHaveBeenCalledWith(3)
})
