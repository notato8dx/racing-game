namespace Time {
    export class Timer {
        #frame = 0n

        tick() {
            this.#frame++
        }

        reset() {
            this.#frame = 0n
        }

        get frame() {
            return this.#frame
        }
    }
}