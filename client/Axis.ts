class Axis {
    constructor(
        private readonly positive: Key,
        private readonly negative: Key
    ) { }

    get factor() {
        return this.positive.factor - this.negative.factor
    }
}