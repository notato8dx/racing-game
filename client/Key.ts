class Key {
    private pressed = false

    constructor(code: string) {
        document.addEventListener('keydown', ({ code: eventCode }) => {
            if (eventCode == code) {
                this.pressed = true
            }
        })

        document.addEventListener('keyup', ({ code: eventCode }) => {
            if (eventCode == code) {
                this.pressed = false
            }
        })
    }

    get factor() {
        return this.pressed ? 1 : 0
    }
}