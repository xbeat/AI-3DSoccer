'use strict';

class HeatMap {

    constructor( canvas, max = 1, data = new Array() ) {
        this.canvas = typeof canvas === 'string' ? document.getElementById( canvas ) : canvas;
        this.ctx = this.canvas.getContext( '2d' );

		this.canvas.width = cxClient;//460 //600
		this.canvas.height = cyClient;//290 //380
		this.canvas.style.margin = "auto";

        this.max = max;
        this.data = data;
        this.defaultRadius = 25;
        this.defaultGradient = {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        };

        if ( !this.circle ) this.radius( this.defaultRadius );
        if ( !this.grad ) this.gradient( this.defaultGradient );

        return this;
    };

    addData( point ) {
        this.data.push( point );
        return this;
    };

    radius( r, blur = 15 ) {

        this.circle = document.createElement( 'canvas' );

        let ctx = this.circle.getContext( '2d' ),
            r2 = this.r = r + blur;

        this.circle.width = this.circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.arc( -r2, -r2, r, 0, Math.PI * 2, true );
        ctx.closePath();
        ctx.fill();

        return this;
    };

    gradient( grad ) {

        let canvas = document.createElement( 'canvas' ),
            ctx = canvas.getContext( '2d' ),
            gradient = ctx.createLinearGradient( 0, 0, 0, 256 );

        canvas.width = 1;
        canvas.height = 256;

        for ( let i in grad ) {
            gradient.addColorStop( +i, grad[ i ] );
        };

        ctx.fillStyle = gradient;
        ctx.fillRect( 0, 0, 1, 256 );
        this.grad = ctx.getImageData( 0, 0, 1, 256 ).data;

        return this;
    };

    draw( minOpacity = 0.05 ) {

        this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

        // draw a grayscale heatmap by putting a blurred circle at each data point
        for ( let i = 0, len = this.data.length; i < len; i++ ) {
            let p = this.data[i];
            this.ctx.globalAlpha = Math.min( Math.max( p[ 2 ] / this.max, minOpacity ), 1 );
            this.ctx.drawImage( this.circle, p[ 0 ] - this.r, p[ 1 ] - this.r );
        };

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        let colored = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );        
        for ( let i = 0, len = colored.data.length, j; i < len; i += 4 ) {

            j = colored.data[i + 3] * 4; // get gradient color from opacity value

            if ( j ) {
                colored.data[i] = this.grad[j];
                colored.data[i + 1] = this.grad[j + 1];
                colored.data[i + 2] = this.grad[j + 2];
            };
        };

        this.ctx.putImageData( colored, 0, 0 );
        return this;
    };

};
