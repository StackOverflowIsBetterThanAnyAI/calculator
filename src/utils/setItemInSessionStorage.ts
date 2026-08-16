export const setItemInSessionStorage = (key: string, value: unknown) => {
    const storage = sessionStorage.getItem('calculator')
    const parsedTracker = storage ? JSON.parse(storage) : {}
    parsedTracker[key] = value
    sessionStorage.setItem('calculator', JSON.stringify(parsedTracker))
}
