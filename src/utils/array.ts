export function shuffle<T>(arr: Array<T>): Array<T> {
    const copy = [...arr];
    for(let i = copy.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = copy[i]
        copy[i] = copy[j]
        copy[j] = temp
    }
    return copy;
}
