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

const secondDuration = 1000n
const minuteDuration = 60n

const ui = document.createElement('div')
ui.style.width = '100%'
ui.style.height = '100%'
ui.style.zIndex = '1'
ui.style.position = 'fixed'
ui.style.padding = '4px'

const input = document.createElement('input')
input.type = 'file'

input.addEventListener('change', async () => {
    if (!input.files || !input.files[0]) {
        throw new Error()
    }

    const track = document.createElement('racetrack')
    const tiles = Arrays.reshape(new Uint8Array(await input.files[0].arrayBuffer()))

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

    const element = document.createElement('start-button')
    element.onclick = () => {
        element.remove()
        const game = new Game(tiles)
        const car = new Figure(document.createElement('car'), track)
        const steeringAxis = new Axis(new Key('ArrowRight'), new Key('ArrowLeft'))
        const minute = document.createElement('span')
        const second = document.createElement('span')
        const millisecond = document.createElement('span')

        const timer = document.createElement('timer')
        timer.replaceChildren(minute, ':', second, '.', millisecond)
        ui.appendChild(timer)

        document.body.appendChild(ui)

        function tick() {
            requestAnimationFrame(() => {
                if (game.tick(steeringAxis.factor)) {
                    car.position = game.position

                    const millisecondCurrent = divide(game.frame * secondDuration, 60n)
                    const secondCurrent = millisecondCurrent / secondDuration

                    minute.textContent = (secondCurrent / minuteDuration).toString()
                    second.textContent = format((secondCurrent % minuteDuration).toString(), 2)
                    millisecond.textContent = format((millisecondCurrent % secondDuration).toString(), 3)

                    tick()
                } else {
                    const button = document.createElement('button')
                    button.textContent = 'Restart'
                    button.style.zIndex = '1'
                    button.style.position = 'fixed'

                    button.onclick = () => {
                        game.reset()
                        tick()
                        button.remove()
                    }

                    ui.appendChild(button)
                }
            })
        }

        tick()
    }

    element.textContent = 'Start'
    document.body.appendChild(element)
})

document.body.appendChild(input)