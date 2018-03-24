/**
 *  Desc:   A SoccerPitch is the main game object. It owns instances of
 *          two soccer teams, two goals, the playing area, the ball
 *          etc. This is the root class for all the game updates and
 *          renders etc
 * 
 */

class SoccerPitch {

    /**
     ** this instantiates the regions the players utilize to  position
     ** themselves
     */
    CreateRegions( width, height ) {
        //index into the vector
        let idx = this.m_Regions.length - 1;

        for ( let col = 0; col < this.NumRegionsHorizontal; ++col ) {
            for ( let row = 0; row < this.NumRegionsVertical; ++row ) {
                this.m_Regions[ idx ] = new Region( this.PlayingArea().Left() + col * width,
                        this.PlayingArea().Top() + row * height,
                        this.PlayingArea().Left() + ( col + 1 ) * width,
                        this.PlayingArea().Top() + ( row + 1 ) * height,
                        idx );
                --idx;
            };
        };
    };

    //------------------------------- ctor -----------------------------------
    //------------------------------------------------------------------------
    constructor( cx, cy ) {
        this.NumRegionsHorizontal = 6;
        this.NumRegionsVertical = 3;
        this.m_cxClient = cx;
        this.m_cyClient = cy;
        this.m_bPaused = false;
        this.m_bGoalKeeperHasBall = false;
        this.m_Regions = new Array( this.NumRegionsHorizontal * this.NumRegionsVertical );
        this.m_bGameOn = true;
        //define the playing area
        this.m_pPlayingArea = new Region( 20, 20, cx - 20, cy - 10 );
        this.m_vecWalls = new Array();

        //create the regions  
        this.CreateRegions( this.PlayingArea().Width() / this.NumRegionsHorizontal,
                this.PlayingArea().Height() / this.NumRegionsVertical );

        //create the goals
        this.m_pRedGoal = new Goal( new Vector2D( this.m_pPlayingArea.Left(), ( cy - Prm.GoalWidth ) / 2 ),
                new Vector2D( this.m_pPlayingArea.Left(), cy - ( cy - Prm.GoalWidth ) / 2 ),
                new Vector2D( 1, 0 ) );

        this.m_pBlueGoal = new Goal( new Vector2D( this.m_pPlayingArea.Right(), ( cy - Prm.GoalWidth ) / 2 ),
                new Vector2D( this.m_pPlayingArea.Right(), cy - ( cy - Prm.GoalWidth ) / 2),
                new Vector2D( -1, 0 ) );

        //create the soccer ball
        this.m_pBall = new SoccerBall( new Vector2D( this.m_cxClient / 2.0, this.m_cyClient / 2.0 ),
                Prm.BallSize,
                Prm.BallMass,
                this.m_vecWalls );

        //create the teams 
        this.m_pRedTeam = new SoccerTeam( this.m_pRedGoal, this.m_pBlueGoal, this, SoccerTeam.red() );
        this.m_pBlueTeam = new SoccerTeam( this.m_pBlueGoal, this.m_pRedGoal, this, SoccerTeam.blue() );

        //make sure each team knows who their opponents are
        this.m_pRedTeam.SetOpponents( this.m_pBlueTeam );
        this.m_pBlueTeam.SetOpponents( this.m_pRedTeam );

        //create the walls
        let TopLeft = new Vector2D( this.m_pPlayingArea.Left(), this.m_pPlayingArea.Top() );
        let TopRight = new Vector2D( this.m_pPlayingArea.Right(), this.m_pPlayingArea.Top() );
        let BottomRight = new Vector2D( this.m_pPlayingArea.Right(), this.m_pPlayingArea.Bottom() );
        let BottomLeft = new Vector2D( this.m_pPlayingArea.Left(), this.m_pPlayingArea.Bottom() );

        this.m_vecWalls.push( new Wall2D( BottomLeft, this.m_pRedGoal.RightPost() ) );
        this.m_vecWalls.push( new Wall2D( this.m_pRedGoal.LeftPost(), TopLeft ) );
        this.m_vecWalls.push( new Wall2D( TopLeft, TopRight ) );
        this.m_vecWalls.push( new Wall2D( TopRight, this.m_pBlueGoal.LeftPost() ) );
        this.m_vecWalls.push( new Wall2D( this.m_pBlueGoal.RightPost(), BottomRight ) );
        this.m_vecWalls.push( new Wall2D( BottomRight, BottomLeft ) );

        let p = new ParamLoader();
        let tick = 0;

        this.pitch();

    };

    //-------------------------------- dtor ----------------------------------
    //------------------------------------------------------------------------
    finalize() {
        super.finalize();
        this.m_pBall = null;

        this.m_pRedTeam = null;
        this.m_pBlueTeam = null;

        this.m_pRedGoal = null;
        this.m_pBlueGoal = null;

        this.m_pPlayingArea = null;

        for ( let i = 0; i < this.m_Regions.size(); ++i ) {
            this.m_Regions[i] = null;
        };
    };

    /**
     *  fixed frame rate (60 by default) so we don't need
     *  to pass a time_elapsed as a parameter to the game entities
     */
    Update() {
        if ( this.m_bPaused ) {
            return;
        };

        //update the balls
        this.m_pBall.Update();

        //update the teams
        this.m_pRedTeam.Update();
        this.m_pBlueTeam.Update();

        //if a goal has been detected reset the pitch ready for kickoff
        if ( this.m_pBlueGoal.Scored( this.m_pBall ) || this.m_pRedGoal.Scored( this.m_pBall ) || this.gameReset == true ) {
            this.m_bGameOn = false;

            if ( this.gameReset == true ){
				this.gameReset = false;
	            this.m_pBlueGoal.m_iNumGoalsScored = 0;
    	        this.m_pRedGoal.m_iNumGoalsScored = 0;            
            };

            //update score
            // the score is inversed because the team that make the score 
            // has not access to the other team object ( Goal.js:25 )
            document.getElementById("scoreTeamA").innerText = this.m_pBlueGoal.m_iNumGoalsScored;
            document.getElementById("scoreTeamB").innerText = this.m_pRedGoal.m_iNumGoalsScored;            

            //reset the ball                                                      
            this.m_pBall.PlaceAtPosition( new Vector2D( this.m_cxClient / 2.0, this.m_cyClient / 2.0 ) );

            //get the teams ready for kickoff
            this.m_pRedTeam.GetFSM().ChangeState( PrepareForKickOff.Instance() );
            this.m_pBlueTeam.GetFSM().ChangeState( PrepareForKickOff.Instance() );
        };
    };

    //------------------------------ Render ----------------------------------
    //------------------------------------------------------------------------
    Render() {
        //draw the grass
        //gdi.DarkGreenPen();
        //gdi.DarkGreenBrush();
        //gdi.Rect(0, 0, this.m_cxClient, this.m_cyClient );
        gdi.clearRect( 0, 0, canvas.width, canvas.height );

        //render regions
        if ( Prm.bRegions ) {
            for ( let r = 0; r < this.m_Regions.length; ++r ) {
                this.m_Regions[ r ].Render( true );
            };
        };

        //render the goals
        //gdi.HollowBrush();
        //gdi.RedPen();
        //gdi.Rect( this.m_pPlayingArea.Left(), ( this.m_cyClient - Prm.GoalWidth ) / 2, this.m_pPlayingArea.Left() + 40,
        //        this.m_cyClient - ( this.m_cyClient - Prm.GoalWidth ) / 2 );

        //gdi.BluePen();
        //gdi.Rect( this.m_pPlayingArea.Right(), ( this.m_cyClient - Prm.GoalWidth ) / 2, this.m_pPlayingArea.Right() - 40,
        //        this.m_cyClient - ( this.m_cyClient - Prm.GoalWidth ) / 2 );

        //render the pitch markings
        //gdi.WhitePen();
        //gdi.Circle( this.m_pPlayingArea.Center(), this.m_pPlayingArea.Width() * 0.125 );
        //gdi.Line( this.m_pPlayingArea.Center().x, this.m_pPlayingArea.Top(), this.m_pPlayingArea.Center().x, this.m_pPlayingArea.Bottom() );
        //gdi.WhiteBrush();
        //gdi.Circle( this.m_pPlayingArea.Center(), 2.0 );

        //the ball
        gdi.WhitePen();
        gdi.WhiteBrush();
        this.m_pBall.Render();

        //Render the teams
        this.m_pRedTeam.Render();
        this.m_pBlueTeam.Render();

        //render the walls
        //gdi.WhitePen();
        //for ( let w = 0; w < this.m_vecWalls.length; ++w ) {
        //    this.m_vecWalls[ w ].Render();
        //};

        //show the score
        //gdi.TextColor( 255, 0, 0 ); // red
        //gdi.TextAtPos( ( this.m_cxClient / 2 ) - 50, this.m_cyClient - 8,
        //        "Red: " + ttos( this.m_pBlueGoal.NumGoalsScored() ) );

        //gdi.TextColor( 0, 0, 255 ); // blue
        //gdi.TextAtPos( ( this.m_cxClient / 2 ) + 10, this.m_cyClient - 8, 
        //        "Blue: " + ttos( this.m_pRedGoal.NumGoalsScored() ) );

        return true;
    };

    pitch(){
        //http://www.fifa.com/img/worldfootball/lotg/law1/Law1_Page13_01.jpg
        let canvasPitch = document.createElement( "canvas" );
        document.body.appendChild( canvasPitch );
        canvasPitch.style.position = "fixed";
        canvasPitch.style.bottom = "10px";
        canvasPitch.style.left = "50%";
        canvasPitch.style.opacity = ".6";
        canvasPitch.style.margin = "0 auto";
        canvasPitch.style.zIndex = "-97";
        canvasPitch.style.transform = "translate( -50%, 0 )";
        canvasPitch.style.zIndex = "20";
        canvasPitch.id = "canvasPitch";
        //canvasPitch.style.transform = "scale(0.7)";

        //canvasPitch.style.transform = "translate( -50%, 0 )";
        canvasPitch.style.backgroundColor = "#009900";    
        canvasPitch.width = 460;
        canvasPitch.height = 290;

        let contextPitch = canvasPitch.getContext('2d');
        let ratio = 1.15;
        let offsetY = 20;

        //Pitch
        contextPitch.strokeStyle = '#fff';
        contextPitch.fillStyle = '#f00';
        contextPitch.lineWidth = 1.5;
        contextPitch.rect( 20 * ratio, 0 * ratio + offsetY, 360 * ratio, 225 * ratio );
        contextPitch.stroke();

        //Center
        contextPitch.beginPath();
        contextPitch.arc( 183 * ratio + offsetY, 112.5 * ratio + offsetY, 30 * ratio, 0, 2 * Math.PI, false ); //big circle
        contextPitch.moveTo( 183 * ratio + offsetY, 0 * ratio + offsetY );
        contextPitch.lineTo( 183 * ratio + offsetY, 225 * ratio + offsetY );//center line
        contextPitch.stroke();
        contextPitch.beginPath();
        contextPitch.arc( 183 * ratio + offsetY, 112.5 * ratio + offsetY, 1 * ratio, 0, 2 * Math.PI, false ); //small circle
        contextPitch.stroke();

        //Big area
        contextPitch.rect( 20 * ratio, 41.25 * ratio + offsetY, 54 * ratio, 142 * ratio ); //left
        contextPitch.rect( 326 * ratio, 41.25 * ratio + offsetY, 54 * ratio, 142 * ratio ); //right

        //Small area
        contextPitch.rect( 20 * ratio, 82 * ratio + offsetY, 18 * ratio, 60 * ratio ); //left
        contextPitch.rect( 362 * ratio, 82 * ratio + offsetY, 18 * ratio, 60 * ratio ); //right
        contextPitch.stroke();

        //circle area
        contextPitch.beginPath()
        contextPitch.arc( 56 * ratio, 112.5 * ratio + offsetY, 1 * ratio, 0, 2 * Math.PI, false ); //left
        contextPitch.stroke();
        contextPitch.beginPath()
        contextPitch.arc( 344 * ratio, 112.5 * ratio + offsetY, 1 * ratio, 0, 2 * Math.PI, false ); //right
        contextPitch.stroke();

        //semi circle 
        contextPitch.beginPath()
        contextPitch.arc( 46 * ratio, 112.5 * ratio + offsetY, 40 * ratio, -0.25 * Math.PI, 0.25 * Math.PI, false ); //left
        contextPitch.stroke();
        contextPitch.beginPath()
        contextPitch.arc( 354 * ratio, 112.5 * ratio + offsetY, 40 * ratio, 0.75 * Math.PI, 1.25 * Math.PI, false ); //left
        contextPitch.stroke();

        //corner
        contextPitch.beginPath()
        contextPitch.arc( 20 * ratio, 0 + offsetY, 7 * ratio, 0 * Math.PI, 0.50 * Math.PI, false );//top left
        contextPitch.stroke();
        contextPitch.beginPath()
        contextPitch.arc( 20 * ratio, 225 * ratio + offsetY, 7 * ratio, -0.50 * Math.PI, 0 * Math.PI, false );//bottom left
        contextPitch.stroke();
        contextPitch.beginPath()
        contextPitch.arc( 380 * ratio, 0 + offsetY, 7 * ratio, 0.50 * Math.PI, 1 * Math.PI, false );//top right
        contextPitch.stroke();
        contextPitch.beginPath()
        contextPitch.arc( 380 * ratio, 225 * ratio + offsetY, 7 * ratio, 1 * Math.PI, 1.50 * Math.PI, false );//bottom right
        contextPitch.stroke();

        //Golie
        contextPitch.rect( 12 * ratio, 97 * ratio + offsetY, 8 * ratio, 24 * ratio + offsetY ); //left
        contextPitch.rect( 380 * ratio, 97 * ratio + offsetY, 8 * ratio, 24 * ratio + offsetY ); //right
        contextPitch.stroke();

        //external line
        contextPitch.moveTo( 12 * ratio, 24 * ratio + offsetY );
        contextPitch.lineTo( 20 * ratio, 24 * ratio + offsetY );//top left
        contextPitch.stroke();

        contextPitch.moveTo( 12 * ratio, 201 * ratio + offsetY );
        contextPitch.lineTo( 20 * ratio, 201 * ratio + offsetY );//bottom left
        contextPitch.stroke();

        contextPitch.moveTo( 380 * ratio, 24 * ratio + offsetY );
        contextPitch.lineTo( 388 * ratio, 24 * ratio + offsetY );//top right
        contextPitch.stroke();

        contextPitch.moveTo( 380 * ratio, 201 * ratio + offsetY );
        contextPitch.lineTo( 388 * ratio, 201 * ratio + offsetY );//bottom right
        contextPitch.stroke();
    };

    TogglePause() {
        this.m_bPaused = !this.m_bPaused;
    };

    Paused() {
        return this.m_bPaused;
    };

    cxClient() {
        return this.m_cxClient;
    };

    cyClient() {
        return this.m_cyClient;
    };

    GoalKeeperHasBall() {
        return this.m_bGoalKeeperHasBall;
    };

    SetGoalKeeperHasBall( b ) {
        this.m_bGoalKeeperHasBall = b;
    };

    PlayingArea() {
        return this.m_pPlayingArea;
    };

    Walls() {
        return this.m_vecWalls;
    };

    Ball() {
        return this.m_pBall;
    };

    GetRegionFromIndex( idx ) {
        //assert ( ( idx >= 0 ) && ( idx < this.m_Regions.size() ) );
        return this.m_Regions[ idx ];
    };

    GameOn() {
        return this.m_bGameOn;
    };

    SetGameOn() {
        this.m_bGameOn = true;
    };

    SetGameOff() {
        this.m_bGameOn = false;
    };
};
