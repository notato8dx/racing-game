class Car {
    private _position: position = {
        linear: [40, 270],
        angular: 0
    }

    tick(steeringFactor: number) {
        this._position = {
            linear: Vector.add(this.position.linear, Vector.multiply([Math.sin(this.position.angular), -Math.cos(this.position.angular)], 2.5)),
            angular: Numbers.reduce(this.position.angular + 0.05 * steeringFactor, 6.283185307179586)
        }
    }

    reset() {
        this._position = {
            linear: [40, 270],
            angular: 0
        }
    }

    get position() {
        return this._position
    }
}