/**
 *  Desc:   A singleton class to help alleviate the tedium of using the
 *          GDI. Call each method using the #define for gdi->
 *          eg gdi->Line(10, 20, 300, 300)
 *          You must always call gdi->StartDrawing() prior to any 
 *          rendering, and isComplete any rendering with gdi->StopDrawing()
 *
 * 
 */

class Polygon {
    constructor(){ };

    addPoint( a, b){
        this.x = a,
        this.y = b
    };
};

class Hdc {
    constructor(){ };

    getColor() { };
};


class Cgdi {

    NumPenColors() {
        return NumColors;
    };

    clearRect( left, top, width, height ){
        this.m_hdc.clearRect( left, top, width, height );    
    };
        
    fillRect( c, left, top, width, height ) {
        let old = this.m_hdc.fillStyle;

        this.m_hdc.fillStyle = "rgb(" + c + ")";
        this.m_hdc.fillRect( left, top, width, height );
        this.m_hdc.fillStyle = "rgb(" + old + ")";
    };

    fontHeight() {
        if ( this.m_hdc == null ) {
            return 0;
        };
        return this.m_hdc.getFontMetrics().getHeight();
    };

    //constructor is private
    constructor() {

        let red = 0;
        let blue = 1;
        let green = 2;
        let black = 3;
        let pink = 4;
        let grey = 5;
        let yellow = 6;
        let orange = 7;
        let purple = 8;
        let brown = 9;
        let white = 10;
        let dark_green = 11;
        let light_blue = 12;
        let light_grey = 13;
        let light_pink = 14;
        let hollow = 15;

        //------------------------------- define some colors
        let colors = [
            [255,0,0],
            [0,0,255],
            [0,255,0],
            [0,0,0],
            [255,200,200],
            [200,200,200], // grey
            [255,255,0],
            [255,170,0],
            [255,0,170],
            [133,90,0], // brown
            [255,255,255],
            [0,100,0], //dark green
            [0,255,255], //light blue
            [200,200,200], //light grey
            [255,230,230] //light pink
        ];

        this.m_BlackPen = this.Color( colors[black][0], colors[black][1], colors[black][2] );
        this.m_WhitePen = this.Color( colors[white][0], colors[white][1], colors[white][2] );
        this.m_RedPen = this.Color( colors[red][0], colors[red][1], colors[red][2] );
        this.m_GreenPen = this.Color( colors[green][0], colors[green][1], colors[green][2] );
        this.m_BluePen = this.Color( colors[blue][0], colors[blue][1], colors[blue][2] );
        this.m_GreyPen = this.Color( colors[grey][0], colors[grey][1], colors[grey][2] );
        this.m_PinkPen = this.Color( colors[pink][0], colors[pink][1], colors[pink][2] );
        this.m_YellowPen = this.Color( colors[yellow][0], colors[yellow][1], colors[yellow][2] );
        this.m_OrangePen = this.Color( colors[orange][0], colors[orange][1], colors[orange][2] );
        this.m_PurplePen = this.Color( colors[purple][0], colors[purple][1], colors[purple][2] );
        this.m_BrownPen = this.Color( colors[brown][0], colors[brown][1], colors[brown][2] );

        this.m_DarkGreenPen = this.Color( colors[dark_green][0], colors[dark_green][1], colors[dark_green][2] );

        this.m_LightBluePen = this.Color( colors[light_blue][0], colors[light_blue][1], colors[light_blue][2] );
        this.m_LightGreyPen = this.Color( colors[light_grey][0], colors[light_grey][1], colors[light_grey][2] );
        this.m_LightPinkPen = this.Color( colors[light_pink][0], colors[light_pink][1], colors[light_pink][2] );

        this.m_ThickBlackPen = this.Color( colors[black][0], colors[black][1], colors[black][2] );
        this.m_ThickWhitePen = this.Color( colors[white][0], colors[white][1], colors[white][2] );
        this.m_ThickRedPen = this.Color( colors[red][0], colors[red][1], colors[red][2] );
        this.m_ThickGreenPen = this.Color( colors[green][0], colors[green][1], colors[green][2] );
        this.m_ThickBluePen = this.Color( colors[blue][0], colors[blue][1], colors[blue][2]  );

        this.m_GreenBrush = this.Brush( colors[green][0], colors[green][1], colors[green][2] );
        this.m_RedBrush = this.Brush( colors[red][0], colors[red][1], colors[red][2] );
        this.m_BlueBrush = this.Brush( colors[blue][0], colors[blue][1], colors[blue][2] );
        this.m_GreyBrush = this.Brush( colors[grey][0], colors[grey][1], colors[grey][2] );
        this.m_BrownBrush = this.Brush( colors[brown][0], colors[brown][1], colors[brown][2]  );
        this.m_YellowBrush = this.Brush( colors[yellow][0], colors[yellow][1], colors[yellow][2] );
        this.m_LightBlueBrush = this.Brush(0, 255, 255);
        this.m_DarkGreenBrush = this.Brush( colors[dark_green][0], colors[dark_green][1], colors[dark_green][2] );
        this.m_OrangeBrush = this.Brush( colors[orange][0], colors[orange][1], colors[orange][2] );

        this.m_hdc = null;

        let NumColors = colors.length;
        this.PenColor = this.Color( 0, 0, 0 );
        let BrushColor = null;
    };

    Brush( r, g, b ) {
        //setColor( r, g, b );
        return "rgb(" + r + "," + g + "," + b + ")";
    };


    Color( r, g, b ) {
        //setColor( r, g, b );
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    finalize() {
        super.finalize();
    };

    static Instance() {
        return new Cgdi();
    };

    BlackPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_BlackPen, false );
        };
    };

    WhitePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_WhitePen, false );
        };
    };

    RedPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_RedPen, false );
        };
    };

    GreenPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_GreenPen, false );
        };
    };

    BluePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_BluePen, false );
        };
    };

    GreyPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_GreyPen, false );
        }
    }

    PinkPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_PinkPen, false );
        };
    };

    YellowPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_YellowPen, false );
        };
    };

    OrangePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_OrangePen, false );
        };
    };

    PurplePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_PurplePen, false );
        };
    };

    BrownPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_BrownPen, false );
        };
    };

    DarkGreenPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_DarkGreenPen, false );
        };
    };

    LightBluePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_LightBluePen, false );
        };
    };

    LightGreyPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_LightGreyPen, false );
        };
    };

    LightPinkPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_LightPinkPen, false );
        };
    };

    ThickBlackPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_ThickBlackPen, false );
        };
    };

    ThickWhitePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_ThickWhitePen, false );
        };
    };

    ThickRedPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_ThickRedPen, false );
        };
    };

    ThickGreenPen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_ThickGreenPen, false );
        };
    };

    ThickBluePen() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_ThickBluePen, false );
        };
    };

    BlackBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.Brush( 0, 0, 0 ), true );
        };
    };

    WhiteBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.Brush( 255, 255, 255 ), true );
        };
    };

    HollowBrush() {
        if ( this.m_hdc != null ) {
            this.BrushColor = null;
        };
    };

    GreenBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_GreenBrush, true );
        };
    };

    RedBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_RedBrush, true );
        };
    };

    BlueBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_BlueBrush, true );
        };
    };

    GreyBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_GreyBrush, true );
        };
    };

    BrownBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_BrownBrush, true );
        };
    };

    YellowBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_YellowBrush, true );
        };
    };

    LightBlueBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_LightBlueBrush, true );
        };
    };

    DarkGreenBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_DarkGreenBrush, true );
        };
    };

    OrangeBrush() {
        if ( this.m_hdc != null ) {
            this.SelectObject( this.m_hdc, this.m_OrangeBrush, true );
        };
    };
    
    SelectObject( m_hdc, color, brush ) {

        if ( brush ) {
            this.BrushColor = color;
        } else {
            this.BrushColor = null;
            this.PenColor = color;
        };
    };

    //ALWAYS call this before drawing
    StartDrawing( hdc ) {
        this.m_hdc = hdc;

        //get the current pen
        /*
        this.m_OldPen = hdc.getColor();
        this.m_OldBrush = new Brush( hdc.getBackground() );
        this.m_OldFont = hdc.getFont();
        hdc.setFont (new Font( m_OldFont.getFontName(), Font.BOLD, 12 ) );
        this.m_hdc.setRenderingHint( RenderingHints.KEY_ANTIALIASING, 
                RenderingHints.VALUE_ANTIALIAS_ON );
        */
    }

    //ALWAYS call this after drawing
    StopDrawing( hdc ) {

        /*
        hdc.setColor( this.m_OldPen );
        hdc.setBackground( this.m_OldBrush );
        hdc.setFont( this.m_OldFont );
        this.m_hdc = null;
        */
    };    
   
    //---------------------------Text
    TextAtPos( a, b, c ) {

        if ( typeof a  === 'object' ){
            var x = a.x;
            var y = a.y;
            var s = b;
        } else {
            var x = a; 
            var y = b;
            var s = c;
        };

        this.m_hdc.fillStyle = this.textColor;
        this.m_hdc.font = "bold 12px Arial";
        this.m_hdc.fillText( s, x, y );

        /*
        let opaque = false;
        let textColor = this.Color( 0, 0, 0 );
        let bg = this.Color( 255, 255, 255 );

        let back = this.m_hdc.getColor();
        y += fontHeight() - 2;
        if ( opaque ) {
            let fm = this.m_hdc.getFontMetrics();
            let lineHeight = fm.getHeight();
            this.m_hdc.setColor( bg );
            this.m_hdc.fillRect( x, y - fm.getAscent() + fm.getDescent(),
                    fm.stringWidth(s), fm.getAscent() );
        };
        this.m_hdc.setColor( textColor );
        this.m_hdc.drawString( s, x, y );
        this.m_hdc.setColor( back );
        */
    };

    TransparentText() {
        this.opaque = false;
    };

    OpaqueText() {
        this.opaque = true;
    };

    TextColor( r, g, b ) {
        this.textColor = this.Color( r, g, b );
    };

    //----------------------------pixels
    DrawDot( pos, color ) {
        DrawDot( pos.x, pos.y, color );
    };

    DrawDot( x, y, color ) {
        this.m_hdc.setColor( this.BrushColor );
        this.m_hdc.fillRect( x, y, 0, 0 );
    };

    //-------------------------Line Drawing

    Line( a, b, x, y ) {

        this.m_hdc.strokeStyle = this.PenColor; 
        if ( this.BrushColor != null ) {
            this.m_hdc.fillStyle = this.BrushColor; 
        };

        this.m_hdc.beginPath();
        this.m_hdc.moveTo( a, b);
        this.m_hdc.lineTo( x, y );
        this.m_hdc.stroke();

    };

    PolyLine( points ) {
        //make sure we have at least 2 points
        if ( points.size() < 2 ) {
            return;
        };
        let p = new Polygon();

        //for ( Vector2D v : points) {
        //    p.addPoint( v.x, v.y );
        //};
        
        this.m_hdc.setColor( this.PenColor );
        this.m_hdc.drawPolygon( p );
    };

    LineWithArrow( from, to, size ) {
        let norm = Vec2DNormalize( sub( to, from ) );

        //calculate where the arrow is attached
        let CrossingPoint = sub( to, mul( norm, size ) );

        //calculate the two extra points required to make the arrowhead
        let ArrowPoint1 = add( CrossingPoint, ( mul( norm.Perp(), 0.4 * size ) ) );
        let ArrowPoint2 = add( CrossingPoint, ( mul( norm.Perp(), 0.4 * size ) ) );

        //draw the line
        this.m_hdc.setColor( this.PenColor );
        this.m_hdc.drawLine( from.x, from.y, CrossingPoint.x, CrossingPoint.y );

        //draw the arrowhead (filled with the currently selected brush)
        let p = new Polygon();

        p.addPoint( ArrowPoint1.x, ArrowPoint1.y );
        p.addPoint( ArrowPoint2.x, ArrowPoint2.y );
        p.addPoint( to.x, to.y);

        //SetPolyFillMode(m_hdc, WINDING);
        if( BrushColor != null ) {
            this.m_hdc.setColor( BrushColor );
            this.m_hdc.fillPolygon( p );
        };
    };

    Cross( pos, diameter ) {
        Line( pos.x - diameter, pos.y - diameter, pos.x + diameter, pos.y + diameter );
        Line( pos.x - diameter, pos.y + diameter, pos.x + diameter, pos.y - diameter );
    };

    //--------------------- Geometry drawing methods
    Rect( left, top, right, bot ) {
        if ( left > right ) {
            let tmp = right;
            right = left;
            left = tmp;
        };

        this.m_hdc.strokeStyle = this.PenColor; 

        this.m_hdc.beginPath();
        this.m_hdc.rect( left, top, right - left, bot - top );

        if ( this.BrushColor != null ) {
            this.m_hdc.fillStyle = this.BrushColor; 
            this.m_hdc.fill();
        };

        this.m_hdc.stroke();
        this.m_hdc.closePath();

    };

    ClosedShape( points ) {
        //let pol = new Polygon();

        //for ( Vector2D p : points ) {
        //    pol.addPoint( p.x, p.y );
        //};

        this.m_hdc.strokeStyle = this.PenColor;
        this.m_hdc.beginPath();
        this.m_hdc.moveTo( points[0].x, points[0].y );
        for( let item = 1; item < points.length; item++ ){ 
            this.m_hdc.lineTo( points[item].x, points[item].y );
        };
        this.m_hdc.closePath();
        this.m_hdc.stroke();

        //this.m_hdc.setColor( this.PenColor );
        //this.m_hdc.drawPolygon( pol );
        //if( BrushColor != null ) {
            //m_hdc.setColor(BrushColor);
            //m_hdc.fillPolygon(pol);
        //};
    };

    Circle( pos, radius ) {
        this.m_hdc.strokeStyle = this.PenColor;

        this.m_hdc.beginPath();
        this.m_hdc.arc(
                    pos.x,
                    pos.y,
                    radius,
                    0,
                    2 * Math.PI );

        if ( this.BrushColor != null ) {
            this.m_hdc.fillStyle = this.BrushColor; 
            this.m_hdc.fill();
        };

        this.m_hdc.stroke();
        this.m_hdc.closePath();
    };

    SetPenColor( color ) {

        switch ( color ) {
            case black:
                BlackPen();
                break;

            case white:
                WhitePen();
                break;

            case red:
                RedPen();
                break;

            case green:
                GreenPen();
                break;

            case blue:
                BluePen();
                break;

            case pink:
                PinkPen();
                break;

            case grey:
                GreyPen();
                break;

            case yellow:
                YellowPen();
                break;

            case orange:
                OrangePen();
                break;

            case purple:
                PurplePen();
                break;

            case brown:
                BrownPen();
                break;

            case light_blue:
                LightBluePen();
                break;

            case light_grey:
                LightGreyPen();
                break;

            case light_pink:
                LightPinkPen();
                break;
        };//end switch
    };
};

let gdi = new Cgdi();