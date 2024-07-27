namespace Time {
    const secondDuration = 1000n
    const minuteDuration = 60n

    function divide(dividend: bigint, divisor: bigint) {
        return (dividend + divisor / 2n) / divisor
    }

    function format(number: string, digit: number): string {
        if (digit <= 1) {
            return number
        } else {
            return `${number.length < digit ? '0' : ''}${format(number, digit - 1)}`
        }
    }

    export class Timer {
        readonly #minute
        readonly #second
        readonly #millisecond

        #frame = 0n

        constructor() {
            const minute = document.createElement('span')
            this.#minute = minute

            const second = document.createElement('span')
            this.#second = second

            const millisecond = document.createElement('span')
            this.#millisecond = millisecond

            const timer = document.createElement('timer')
            timer.replaceChildren(minute, ':', second, '.', millisecond)
            document.body.appendChild(timer)
        }

        tick() {
            const millisecond = divide(this.#frame * secondDuration, 60n)
            const second = millisecond / secondDuration

            this.#minute.textContent = (second / minuteDuration).toString()
            this.#second.textContent = format((second % minuteDuration).toString(), 2)
            this.#millisecond.textContent = format((millisecond % secondDuration).toString(), 3)

            this.#frame++
        }

        reset() {
            this.#frame = 0n
        }
    }
}