type bit = 0 | 1

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

        constructor(element: HTMLElement, trackArea: Node) {
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

    export class Game {
        readonly #steeringAxis = new Axis(new Key('ArrowRight'), new Key('ArrowLeft'))
        readonly #car
        readonly #timer = new Time.Timer()
        readonly #track

        #position: vector = [40, 270]
        #orientation = 0

        constructor(track: (number | undefined)[][], trackArea: Node) {
            this.#track = track
            this.#car = new Figure(document.createElement('car'), trackArea)
            this.#tick()
        }

        #tick() {
            const row = this.#track[Math.trunc(this.#position[1] / 10)]

            if (!row) {
                return
            }

            if (row[Math.trunc(this.#position[0] / 10)] == 1) {
                console.log('collision')
            }

            this.#car.transform = {
                position: this.#position,
                orientation: this.#orientation
            }

            this.#timer.tick()

            this.#position = add(this.#position, multiply([Math.sin(this.#orientation), -Math.cos(this.#orientation)], 2.5)),
                this.#orientation = reduce(this.#orientation + 0.05 * this.#steeringAxis.factor, 6.283185307179586)

            requestAnimationFrame(() => {
                this.#tick()
            })
        }
    }
}

function slice(array: Uint8Array, start: number) {
    return [array[start], array[start + 1], array[start + 2], array[start + 3], array[start + 4], array[start + 5], array[start + 6], array[start + 7], array[start + 8], array[start + 9], array[start + 10], array[start + 11], array[start + 12], array[start + 13], array[start + 14], array[start + 15], array[start + 16], array[start + 17], array[start + 18], array[start + 19], array[start + 20], array[start + 21], array[start + 22], array[start + 23], array[start + 24], array[start + 25], array[start + 26], array[start + 27], array[start + 28], array[start + 29], array[start + 30], array[start + 31], array[start + 32], array[start + 33], array[start + 34], array[start + 35], array[start + 36], array[start + 37], array[start + 38], array[start + 39], array[start + 40], array[start + 41], array[start + 42], array[start + 43], array[start + 44], array[start + 45], array[start + 46], array[start + 47], array[start + 48], array[start + 49], array[start + 50], array[start + 51], array[start + 52], array[start + 53], array[start + 54], array[start + 55], array[start + 56], array[start + 57], array[start + 58], array[start + 59], array[start + 60], array[start + 61], array[start + 62], array[start + 63], array[start + 64], array[start + 65], array[start + 66], array[start + 67], array[start + 68], array[start + 69], array[start + 70], array[start + 71], array[start + 72], array[start + 73], array[start + 74], array[start + 75], array[start + 76], array[start + 77], array[start + 78], array[start + 79]]
}

function createTrack(buffer: Uint8Array) {
    return [
        slice(buffer, 0),
        slice(buffer, 80),
        slice(buffer, 160),
        slice(buffer, 240),
        slice(buffer, 320),
        slice(buffer, 400),
        slice(buffer, 480),
        slice(buffer, 560),
        slice(buffer, 640),
        slice(buffer, 720),
        slice(buffer, 800),
        slice(buffer, 880),
        slice(buffer, 960),
        slice(buffer, 1040),
        slice(buffer, 1120),
        slice(buffer, 1200),
        slice(buffer, 1280),
        slice(buffer, 1360),
        slice(buffer, 1440),
        slice(buffer, 1520),
        slice(buffer, 1600),
        slice(buffer, 1680),
        slice(buffer, 1760),
        slice(buffer, 1840),
        slice(buffer, 1920),
        slice(buffer, 2000),
        slice(buffer, 2080),
        slice(buffer, 2160),
        slice(buffer, 2240),
        slice(buffer, 2320),
        slice(buffer, 2400),
        slice(buffer, 2480),
        slice(buffer, 2560),
        slice(buffer, 2640),
        slice(buffer, 2720),
        slice(buffer, 2800),
        slice(buffer, 2880),
        slice(buffer, 2960),
        slice(buffer, 3040),
        slice(buffer, 3120),
        slice(buffer, 3200),
        slice(buffer, 3280),
        slice(buffer, 3360),
        slice(buffer, 3440),
        slice(buffer, 3520),
        slice(buffer, 3600),
        slice(buffer, 3680),
        slice(buffer, 3760),
        slice(buffer, 3840),
        slice(buffer, 3920),
        slice(buffer, 4000),
        slice(buffer, 4080),
        slice(buffer, 4160),
        slice(buffer, 4240)
    ]
}

function append(element: HTMLElement, onclick: () => void) {
    element.onclick = () => {
        element.remove()
        onclick()
    }

    element.textContent = 'Start'
    document.body.appendChild(element)
}

function setupTrackArea(track: (number | undefined)[][], trackArea: Node) {
    for (const row of track) {
        const rowElement = document.createElement('div')
        rowElement.style.minHeight = '10px'
        rowElement.style.display = 'flex'

        for (const tile of row) {
            const tileElement = document.createElement('div')
            tileElement.style.width = '10px'
            tileElement.style.height = '10px'

            if (tile == 1) {
                tileElement.style.backgroundColor = 'white'
            } else {
                tileElement.style.backgroundColor = 'black'
            }

            rowElement.appendChild(tileElement)
        }

        trackArea.appendChild(rowElement)
    }

    document.body.replaceChildren(trackArea)

    append(document.createElement('start-button'), () => {
        new Physics.Game(track, trackArea)
    })
}

{
    const input = document.createElement('input')
    input.type = 'file'

    input.addEventListener('change', async () => {
        if (!input.files || !input.files[0]) {
            throw new Error()
        }

        setupTrackArea(createTrack(new Uint8Array(await input.files[0].arrayBuffer())), document.createElement('racetrack'))
    })

    document.body.appendChild(input)
}