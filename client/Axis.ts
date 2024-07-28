class Axis {
    readonly #positive
    readonly #negative

    constructor(positive: Key, negative: Key) {
        this.#positive = positive
        this.#negative = negative
    }

    get factor() {
        return this.#positive.factor - this.#negative.factor
    }
}

class Key {
    #pressed = false

    constructor(code: string) {
        document.addEventListener('keydown', ({ code: eventCode }) => {
            if (eventCode == code) {
                this.#pressed = true
            }
        })

        document.addEventListener('keyup', ({ code: eventCode }) => {
            if (eventCode == code) {
                this.#pressed = false
            }
        })
    }

    get factor() {
        return this.#pressed ? 1 : 0
    }
}