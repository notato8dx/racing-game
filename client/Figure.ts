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