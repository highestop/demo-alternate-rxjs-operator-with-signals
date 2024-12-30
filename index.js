import { debounce } from 'lodash'
import { createSignalSwitch } from 'signal-transaction'
import { delay } from 'signal-timers'

export const createAsyncTask = (signal, task) => {
    const signalSwitch = createSignalSwitch(signal)

    return signalSwitch(async (signal, params) => {
        return await task(signal, params)
    })
}

export const createDebouncedAsyncTask = (signal, task, delay) => {
    const asyncTask = createAsyncTask(signal, task)
    const debouncedTask = debounce(asyncTask, delay)

    signal.addEventListener('abort', () => {
        debouncedTask.cancel()
    })

    return debouncedTask
}

export const retryAsyncTask = async (task, limit, signal) => {
    for (let i = 0; i < limit; i++) {
        try {
            return await task(signal, i)
        } catch (e) {
            if (signal.aborted || i === limit - 1) {
                throw e
            } else {
                await delay(1000 * i, { signal })
            }
        }
    }
}
