class Player {
    constructor(username, socket) {
        this.username = username;
        this.socket = socket;

        // These are internal, DO NOT USE, use getOrientation() instead
        this.beta = 0;
        this.gamma = 0;

        this.setupOrientationDataReception();
    }

    setupOrientationDataReception() {
        this.socket.on('orientation', (packet) => {
            this.beta = packet.orientation_data.beta;
            this.gamma = packet.orientation_data.gamma;
            
            // console.log('Player: ', this.username, '\t|\torientation', this.gamma, this.beta);
            console.log('Player: ', this.username, '\t|\tscaled-orientation', this.getOrientation());
        });
    }

    // This is the only method that should be used to access the orientation data
    // Returns an object {x, y} where x and y are the orientation angles scaled to be between -1 and 1 
    // If the device is held upright, x and y will be 0
    // If the device is tilted right, x will be between 0 and 1, left x will be between -1 and 0
    // If the device is tilted forward, y will be between 0 and 1, backward y will be between -1 and 0
    getOrientation() {
        return {
            x: this.gamma / 90,
            y: this.beta / 90
        };
    }  
}

module.exports = Player; // Export using CommonJS syntax

