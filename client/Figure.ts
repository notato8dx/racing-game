class Figure {
    private readonly style

    constructor(element: HTMLElement, trackArea: Node) {
        trackArea.appendChild(element)
        this.style = element.style
    }

    set position({
        linear: [horizontal, vertical],
        angular
    }: {
        linear: vector,
        angular: number
    }) {
        this.style.transform = `translateX(${horizontal}px) translateY(${vertical}px) rotateZ(${angular}rad)`
    }
}