type vector = [number, number]

namespace Vector {
    export function add(augend: vector, addend: vector): vector {
        return [augend[0] + addend[0], augend[1] + addend[1]]
    }

    export function multiply(multiplicand: vector, multiplier: number): vector {
        return [multiplicand[0] * multiplier, multiplicand[1] * multiplier]
    }
}