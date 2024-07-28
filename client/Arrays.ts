namespace Arrays {
    function slice(array: Uint8Array, start: number, i = 0): Bit[] {
        const bit = array[start + i]

        if (bit != 0 && bit != 1) {
            throw new Error('File format is invalid')
        }

        if (i == 79) {
            return [bit]
        } else {
            return [bit, ...slice(array, start, i + 1)]
        }
    }

    export function reshape(buffer: Uint8Array) {
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
}