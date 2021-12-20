class StampListener {
    constructor(config) {
        this.stampScreenElement = config.stampScreenElementId ?
            document.getElementById(config.stampScreenElementId) :
            window;

        if (!this.stampScreenElement) {
            console.warn(`StampListener requires an ID of a valid element. ID provided: ${config.stampScreenElementId}`);
            return;
        }

        this.isScreenStampable = true;

        this.preventScrolling = config.preventScrolling || false;
        this.preventZooming = config.preventZooming || false;

        if (this.preventScrolling) {
            this.stampScreenElement.addEventListener('touchmove', event => {
                // Prevent scrolling on this element
                event.preventDefault();
            });
        }

        if (this.preventZooming) {
            this.stampScreenElement.addEventListener('gesturechange', event => {
                // Disable browser zoom
                event.preventDefault();
            });
        }
    }

    listen(onStamp) {
        this.stampScreenElement.addEventListener('touchstart', event => {
            const touches = Object.values(event.touches).filter(touch => {
                return typeof touch.pageX === 'number' && typeof touch.pageY === 'number';
            });
            if (touches.length >= 5 && this.isScreenStampable) {
                this.isScreenStampable = false;
                const stampDataPoints = touches.map(touch => [touch.pageX, touch.pageY]);
                if (onStamp instanceof Function) {
                    onStamp(stampDataPoints, () => this.isScreenStampable = true);
                }
            }
        });
    }
}

export default StampListener;
