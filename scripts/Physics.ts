namespace Physics {
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

    class Game {
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

            if (!row || row[Math.trunc(this.#position[0] / 10)] == 1) {
                return
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

    function append(element: HTMLElement, onclick: () => void) {
        element.onclick = () => {
            element.remove()
            onclick()
        }

        element.textContent = 'Start'
        document.body.appendChild(element)
    }

    export function initialize(track: Node, tiles: Arrays.Bit[][]) {
        for (const row of tiles) {
            const rowElement = document.createElement('track-row')

            for (const tile of row) {
                const tileElement = document.createElement('track-tile')
                tileElement.style.backgroundColor = (['black', 'white'] as const)[tile]
                rowElement.appendChild(tileElement)
            }

            track.appendChild(rowElement)
        }

        document.body.replaceChildren(track)

        append(document.createElement('start-button'), () => {
            new Game(tiles, track)
        })
    }
}

{
    const input = document.createElement('input')
    input.type = 'file'

    input.addEventListener('change', async () => {
        if (!input.files || !input.files[0]) {
            throw new Error()
        }

        Physics.initialize(document.createElement('racetrack'), Arrays.reshape(new Uint8Array(await input.files[0].arrayBuffer())))
    })

    document.body.appendChild(input)
}