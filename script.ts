namespace Physics {
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

        class Element {
            readonly #element

            constructor(element: HTMLSpanElement) {
                this.#element = element
            }

            set time(time: string) {
                this.#element.textContent = time
            }
        }

        export class Timer {
            readonly #minute
            readonly #second
            readonly #millisecond

            #frame = 0n

            constructor() {
                const minute = document.createElement('span')
                this.#minute = new Element(minute)

                const second = document.createElement('span')
                this.#second = new Element(second)

                const millisecond = document.createElement('span')
                this.#millisecond = new Element(millisecond)

                const timer = document.createElement('timer')
                timer.replaceChildren(minute, ':', second, '.', millisecond)
                document.body.appendChild(timer)
            }

            tick() {
                const millisecond = divide(this.#frame * secondDuration, 60n)
                const second = millisecond / secondDuration

                this.#minute.time = (second / minuteDuration).toString()
                this.#second.time = format((second % minuteDuration).toString(), 2)
                this.#millisecond.time = format((millisecond % secondDuration).toString(), 3)

                this.#frame++
            }
        }
    }

    type vector = [number, number]

    function add(augend: vector, addend: vector): vector {
        return [augend[0] + addend[0], augend[1] + addend[1]]
    }

    function multiply(multiplicand: vector, multiplier: number): vector {
        return [multiplicand[0] * multiplier, multiplicand[1] * multiplier]
    }

    function reduce(number: number, modulus: number) {
        return (number + modulus) % modulus
    }

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

    class Figure {
        readonly #style

        constructor(element: HTMLElement) {
            document.body.appendChild(element)
            this.#style = element.style
        }

        set transform({
            position: [horizontalPosition, verticalPosition],
            orientation
        }: {
            position: vector,
            orientation: number
        }) {
            this.#style.transform = `translateX(${horizontalPosition}px) translateY(${verticalPosition}px) rotateZ(${orientation}rad)`
        }
    }

    export class Game {
        readonly #steeringAxis = new Axis(new Key('ArrowRight'), new Key('ArrowLeft'))
        readonly #car = new Figure(document.createElement('car'))
        readonly #timer = new Time.Timer()
        readonly #track

        constructor(track: Uint8Array[]) {
            this.#track = track
        }

        tick(position: vector, orientation: number) {
            if (this.#track[Math.trunc(position[1] / 10)][Math.trunc(position[0] / 10)] == 1) {
                console.log('collision')
            }

            this.#car.transform = { position, orientation }
            this.#timer.tick()

            requestAnimationFrame(() => {
                this.tick(
                    add(position, multiply([Math.sin(orientation), -Math.cos(orientation)], 2.5)),
                    reduce(orientation + 0.05 * this.#steeringAxis.factor, 6.283185307179586)
                )
            })
        }
    }
}

const input = document.createElement('input')
input.type = 'file'
input.addEventListener('change', () => {
    if (input.files == null) {
        return
    }

    input.files[0].arrayBuffer().then(arrayBuffer => {
        const bytes = new Uint8Array(arrayBuffer)
        const track = [
            bytes.slice(0, 80),
            bytes.slice(80, 160),
            bytes.slice(160, 240),
            bytes.slice(240, 320),
            bytes.slice(320, 400),
            bytes.slice(400, 480),
            bytes.slice(480, 560),
            bytes.slice(560, 640),
            bytes.slice(640, 720),

            bytes.slice(720, 800),
            bytes.slice(800, 880),
            bytes.slice(880, 960),
            bytes.slice(960, 1040),
            bytes.slice(1040, 1120),
            bytes.slice(1120, 1200),
            bytes.slice(1200, 1280),
            bytes.slice(1280, 1360),
            bytes.slice(1360, 1440),

            bytes.slice(1440, 1520),
            bytes.slice(1520, 1600),
            bytes.slice(1600, 1680),
            bytes.slice(1680, 1760),
            bytes.slice(1760, 1840),
            bytes.slice(1840, 1920),
            bytes.slice(1920, 2000),
            bytes.slice(2000, 2080),
            bytes.slice(2080, 2160),

            bytes.slice(2160, 2240),
            bytes.slice(2240, 2320),
            bytes.slice(2320, 2400),
            bytes.slice(2400, 2480),
            bytes.slice(2480, 2560),
            bytes.slice(2560, 2640),
            bytes.slice(2640, 2720),
            bytes.slice(2720, 2800),
            bytes.slice(2800, 2880),

            bytes.slice(2880, 2960),
            bytes.slice(2960, 3040),
            bytes.slice(3040, 3120),
            bytes.slice(3120, 3200),
            bytes.slice(3200, 3280),
            bytes.slice(3280, 3360),
            bytes.slice(3360, 3440),
            bytes.slice(3440, 3520),
            bytes.slice(3520, 3600),

            bytes.slice(3600, 3680),
            bytes.slice(3680, 3760),
            bytes.slice(3760, 3840),
            bytes.slice(3840, 3920),
            bytes.slice(3920, 4000),
            bytes.slice(4000, 4080),
            bytes.slice(4080, 4160),
            bytes.slice(4160, 4240),
            bytes.slice(4240, 4320)
        ]

        for (const row of track) {
            const rowElement = document.createElement('div')
            rowElement.style.minHeight = '10px'
            rowElement.style.display = 'flex'

            for (const tile of row) {
                const tileElement = document.createElement('div')
                tileElement.style.width = '10px'
                tileElement.style.height = '10px'
                tileElement.style.backgroundColor = ['black', 'white'][tile]
                rowElement.appendChild(tileElement)
            }

            document.body.appendChild(rowElement)
        }

        const game = new Physics.Game(track)

        const button = document.createElement('button')
        button.textContent = 'Start'
        button.onclick = () => {
            game.tick([40, 270], 0)
        }

        document.body.appendChild(button)

    })
})
document.body.appendChild(input)