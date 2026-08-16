export const getItemFromSessionStorage = () => {
    if (typeof window === 'undefined') {
        return
    }
    const storedData = sessionStorage.getItem('calculator')
    return storedData ? JSON.parse(storedData) : {}
}
