namespace Numbers {
    export function reduce(number: number, modulus: number) {
        return (number + modulus) % modulus
    }
}