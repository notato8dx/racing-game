const trackArea = document.createElement('div')
trackArea.style.position = 'relative'

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
            trackArea.appendChild(element)
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

    function createTrack(buffer: Uint8Array) {
        return [
            buffer.slice(0, 80),
            buffer.slice(80, 160),
            buffer.slice(160, 240),
            buffer.slice(240, 320),
            buffer.slice(320, 400),
            buffer.slice(400, 480),
            buffer.slice(480, 560),
            buffer.slice(560, 640),
            buffer.slice(640, 720),

            buffer.slice(720, 800),
            buffer.slice(800, 880),
            buffer.slice(880, 960),
            buffer.slice(960, 1040),
            buffer.slice(1040, 1120),
            buffer.slice(1120, 1200),
            buffer.slice(1200, 1280),
            buffer.slice(1280, 1360),
            buffer.slice(1360, 1440),

            buffer.slice(1440, 1520),
            buffer.slice(1520, 1600),
            buffer.slice(1600, 1680),
            buffer.slice(1680, 1760),
            buffer.slice(1760, 1840),
            buffer.slice(1840, 1920),
            buffer.slice(1920, 2000),
            buffer.slice(2000, 2080),
            buffer.slice(2080, 2160),

            buffer.slice(2160, 2240),
            buffer.slice(2240, 2320),
            buffer.slice(2320, 2400),
            buffer.slice(2400, 2480),
            buffer.slice(2480, 2560),
            buffer.slice(2560, 2640),
            buffer.slice(2640, 2720),
            buffer.slice(2720, 2800),
            buffer.slice(2800, 2880),

            buffer.slice(2880, 2960),
            buffer.slice(2960, 3040),
            buffer.slice(3040, 3120),
            buffer.slice(3120, 3200),
            buffer.slice(3200, 3280),
            buffer.slice(3280, 3360),
            buffer.slice(3360, 3440),
            buffer.slice(3440, 3520),
            buffer.slice(3520, 3600),

            buffer.slice(3600, 3680),
            buffer.slice(3680, 3760),
            buffer.slice(3760, 3840),
            buffer.slice(3840, 3920),
            buffer.slice(3920, 4000),
            buffer.slice(4000, 4080),
            buffer.slice(4080, 4160),
            buffer.slice(4160, 4240),
            buffer.slice(4240, 4320)
        ]
    }

    export class Game {
        readonly #steeringAxis = new Axis(new Key('ArrowRight'), new Key('ArrowLeft'))
        readonly #car = new Figure(document.createElement('car'))
        readonly #timer = new Time.Timer()
        readonly #track

        constructor(buffer: ArrayBuffer) {
            this.#track = createTrack(new Uint8Array(buffer))

            for (const row of this.#track) {
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

                trackArea.appendChild(rowElement)
            }
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

namespace Writing {
    interface Child {
        remove: () => void
    }

    function start(game: Physics.Game) {
        const button = document.createElement('button')
        button.style.zIndex = '1'
        button.style.position = 'absolute'
        button.textContent = 'Start'
        button.onclick = () => {
            button.remove()
            game.tick([40, 270], 0)
        }
        document.body.appendChild(button)
    }

    export function write(node: Node & Child): Child {
        document.body.appendChild(node)
        return node
    }

    export function initialize(heading: Child, input: HTMLInputElement) {
        input.type = 'file'

        input.addEventListener('change', () => {
            if (!input.files) {
                return
            }

            input.remove()

            input.files[0].arrayBuffer().then(buffer => {
                start(new Physics.Game(buffer))
                heading.remove()
                document.body.appendChild(trackArea)
            })
        })

        document.body.appendChild(input)
    }
}

Writing.initialize(Writing.write(document.createTextNode('Racing Game')), document.createElement('input'))