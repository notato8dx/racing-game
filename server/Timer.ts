class Timer {
    private _frame = 0n

    tick() {
        this._frame++
    }

    reset() {
        this._frame = 0n
    }

    get frame() {
        return this._frame
    }
}