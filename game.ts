type vector = [number, number]

const add = (augend: vector, addend: vector): vector => {
    return [augend[0] + addend[0], augend[1] + addend[1]]
}

const divide = (dividend: bigint, divisor: bigint) => {
    return (dividend + divisor / 2n) / divisor
}

const format = (number: string, digit: number): string => {
    if (digit <= 1) {
        return number
    } else {
        return `${number.length < digit ? '0' : ''}${format(number, digit - 1)}`
    }
}

const multiply = (multiplicand: vector, multiplier: number): vector => {
    return [multiplicand[0] * multiplier, multiplicand[1] * multiplier]
}

const reduce = (number: number, modulus: number) => {
    return (number + modulus) % modulus
}

const steering = (() => {
    let turningLeft = false
    let turningRight = false

    for (const [type, value] of [
        ['keydown', true],
        ['keyup', false]
    ] as ['keydown' | 'keyup', boolean][]) {
        document.addEventListener(type, ({ code }) => {
            if (code == 'ArrowLeft') {
                turningLeft = value
            }

            if (code == 'ArrowRight') {
                turningRight = value
            }
        })
    }

    return {
        get factor() {
            return (turningRight ? 1 : 0) - (turningLeft ? 1 : 0)
        }
    }
})()

const timer = (() => {
    const secondDuration = 1000n

    const minuteElement = document.createElement('span')
    const secondElement = document.createElement('span')
    const millisecondElement = document.createElement('span')

    let frame = 0n

    {
        const time = document.createElement('time')
        time.style.color = 'white'
        time.style.fontFamily = 'monospace'
        time.replaceChildren(minuteElement, ':', secondElement, '.', millisecondElement)
        document.body.appendChild(time)
    }

    const update = (millisecond: bigint) => {
        const minuteDuration = 60n
        const second = millisecond / secondDuration

        minuteElement.textContent = (second / minuteDuration).toString()
        secondElement.textContent = format((second % minuteDuration).toString(), 2)
        millisecondElement.textContent = format((millisecond % secondDuration).toString(), 3)
    }

    return {
        tick: () => {
            update(divide(frame * secondDuration, 60n))
            frame++
        }
    }
})()

const car = (() => {
    const style = (() => {
        const element = document.createElement('div')
        element.style.width = '10px'
        element.style.height = '15px'
        element.style.backgroundColor = 'red'

        document.body.appendChild(
            (() => {
                const div = document.createElement('div')
                div.style.position = 'absolute'
                div.style.transform = 'translateY(-7.5px) translateX(-5px)'
                div.appendChild(element)
                return div
            })()
        )

        return element.style
    })()
    
    return {
        set transform({
            position: [horizontalPosition, verticalPosition],
            orientation
        }: {
            position: vector,
            orientation: number
        }) {
            style.transform = `translateX(${horizontalPosition}px) translateY(${verticalPosition}px) rotateZ(${orientation}rad)`
        } 
    }
})()

; (function tick(position: vector, orientation: number) {
    car.transform = {
        position,
        orientation
    }

    timer.tick()

    requestAnimationFrame(() => {
        tick(
            add(position, multiply([Math.sin(orientation), -Math.cos(orientation)], 2.5)),
            reduce(orientation + 0.05 * steering.factor, 6.283185307179586)
        )
    })
})([40, 270], 0)