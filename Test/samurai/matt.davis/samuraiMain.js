/** Temporary globals ************************************************************/

/** An image to be used by the application  
    @type Image
*/
var g_back0 = new Image();
g_back0.src = "repeatBackground.png";

/** An image to be used by the application  
    @type Image
*/
var g_back1 = new Image();
g_back1.src = "fruitSalad.png";

/** An image to be used by the application  
    @type Image
*/
var g_run = new Image();
g_run.src = "gnu.png";

/** An image to be used by the application  
    @type Image

var g_back2 = new Image();
g_back2.src = "jsplatformer4_b2.png";
*/

/** End of temp globals **********************************************************/


/** Our main HQ to control our game objects
	@type SamuraiHQ
*/
var s_SamuraiHQ

/** Global var to hol the FPS we want to target
	@type Number
*/
var FPS = 30;

/** seconds between redraw this will help us track our redraw rate
	@type Number
*/
var REDRAW_RATE	 = 1/FPS



/**	Entry point */
window.onload = init;

function init()
{
	new SamuraiHQ().buildHQ();
}
// Should be split into it's own JS file called samurai.js ********************************************************
function Samurai()
{
	/** X axis position
		@type number
	*/
	this.x = 0;
	
	/** Y axis position
		@type number
	*/
	this.y = 0;

	/** Z-order helps determin what order to draw objects lower gets drawn first and will
		be drawn over by objects with a higher z-order
	*/
	this.zOrder = 0;
	
	this.buildSamurai = function(/**Number*/ x, /**Number*/ y, /**Number*/ z)
	{
		this.x = x;
		this.y = y;
		this.zOrder = z;
		s_SamuraiHQ.addSamurai(this);
		return this;
	}
		
	/** Clean up
	*/
	this.destroySamurai = function()
	{
		s_SamuraiHQ.removeSamurai(this);
	}
}



// Should be split into it's own JS file called samuraiHQ.js ******************************************************
function SamuraiHQ()
{
	/** A reference to the main canvas visable to the user.
		@type canvasRenderingContext2D
	*/
	this.canvas = null
	
	/** A reference to the 2D context of the canvas element
        @type CanvasRenderingContext2D
    */
	this.canvas2D = null;
	
	
	/** We need a Backbuffer to help with frame slicing we will create our own canvas
		and use that to predraw the canvas on.  Then we can switch from the secondary 
		or back canvas to the visible canvas without slicing.
	*/
	
    /** A reference to the in-memory canvas used as a back buffer 
        @type HTMLCanvasElement
    */
    this.backBuffer = null;
    /** A reference to the backbuffer 2D context 
        @type CanvasRenderingContext2D
    */
    this.backBufferContext2D = null;

	/** An array of game objects 
        @type Arary
    */
    this.samurais = new Array();
	
    /** The time that the last frame was rendered  
        @type Date
    */
    this.lastFrame = new Date().getTime();
	
    /** The global scrolling value of the x axis  
        @type Number
    */
    this.xScroll = 0;
	
    /** The global scrolling value of the y axis  
        @type Number
    */
    this.yScroll = 0;
	
    /** A reference to the WarRoom instance  
        @type WarRoom
    */
    this.warRoom = null;
	
	
	/** A reference to the ApplicationManager instance  
        @type ApplicationManager
    */
    this.applicationManager = null;

	
	/**
        Initialises HQ
        @return A reference to the HQ
    */
    this.buildHQ = function()
    {
        // set the global pointer to reference this HQ
        s_SamuraiHQ = this;
        
        // get references to the canvas elements and their 2D contexts
        this.canvas = document.getElementById('canvas');
        this.context2D = this.canvas.getContext('2d');
		
        this.backBuffer = document.createElement('canvas');
        this.backBuffer.width = this.canvas.width;
        this.backBuffer.height = this.canvas.height;
        this.backBufferContext2D = this.backBuffer.getContext('2d');
		
		
		//**********************************************************************************Uncomment for sprites******************************
		// create a new ApplicationManager
        //this.applicationManager = new ApplicationManager().buildApplicationManager();
        
		//**********************************************************************************Uncomment for background***************************
        // create a new WarRoom
        this.warRoom = new WarRoom().buildWarRoom();
        
        // use setInterval to call the draw function 
        setInterval(function() { s_SamuraiHQ.draw.call(s_SamuraiHQ); }, REDRAW_RATE);
        
        return this;        
    }
	
	/**
        The render loop
    */
    this.draw = function ()
    {
        // calculate the time since the last frame
        var thisFrame = new Date().getTime();
        var dt = (thisFrame - this.lastFrame)/1000;
        this.lastFrame = thisFrame;
        
        // clear the drawing contexts
        this.backBufferContext2D.clearRect(0, 0, this.backBuffer.width, this.backBuffer.height);
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // first update all the game objects
        for (x in this.samurais)
        {
            if (this.samurais[x].update)
            {
                this.samurais[x].update(dt, this.backBufferContext2D, this.xScroll, this.yScroll);
            }
        }

        // then draw the game objects
        for (x in this.samurais)
        {
            if (this.samurais[x].draw)
            {
                this.samurais[x].draw(dt, this.backBufferContext2D, this.xScroll, this.yScroll);
            }
        }
        
        // copy the back buffer to the displayed canvas
        this.context2D.drawImage(this.backBuffer, 0, 0);
    };
	
	/**
        Adds a new samuria to the samurais collection
        @param samurai The object to add
    */
    this.addSamurai = function(samurai)
    {
        this.samurais.push(samurai);
        this.samurais.sort(function(a,b){return a.zOrder - b.zOrder;})
    };
    
    /**
        Removes a samurai from the gameObjects collection
        @param samurai The object to remove
    */
    this.removeSamurai = function(samurai)
    {
        this.samurais.removeObject(samurai);
    }
	
}	


// Should be split into it's own JS file called warRoom.js ******************************************************
function WarRoom()
{
    /**
        Initialises this object
        @return A reference to the initialised object
    */
    this.buildWarRoom = function()
    {
        this.buildSamurai();
		//this.background3 = new SamuraiMural().buildSamuraiMural(g_back2, 0, 100, 3, 600, 320, 1);
        this.background2 = new SamuraiMural().buildSamuraiMural(g_back1, 0, 0, 2, 600, 400, 0.75);        
        this.background = new SamuraiMural().buildSamuraiMural(g_back0, 0, 0, 1, 600, 400, 0.5);
        return this;
    }
	
	/**
        Updates the object
        @param dt The time since the last frame in seconds
        @param context The drawing context 
        @param xScroll The global scrolling value of the x axis  
        @param yScroll The global scrolling value of the y axis 
    */
    this.update = function(/**Number*/ dt, /**CanvasRenderingContext2D*/ context, /**Number*/ xScroll, /**Number*/ yScroll)
    {
		s_SamuraiHQ.xScroll += 50 * dt;
	}
}
WarRoom.prototype = new Samurai();
	
	
// Should be split into it's own JS file called samuraiMural.js ******************************************************
function SamuraiMural()
{
    /** The width that the final image will take up
		@type Number
	*/
	this.width = 0;
	/** The height that the final image will take up
		@type Number
	*/
    this.height = 0;
	/** How much of the scrollX and scrollY to apply when drawing
		@type Number
	*/
    this.scrollFactor = 1;
	
    /**
        Initialises this object
        @return A reference to the initialised object
    */
    this.buildSamuraiMural = function(image, x, y, z, width, height, scrollFactor)
    {
        this.buildUnStealthySamurai(image, x, y, z);
        this.width = width;
        this.height = height;
        this.scrollFactor = scrollFactor;
        return this;
    }
	
    /**
        Clean this object up
    */
    this.destroySamuraiMural = function()
    {
        this.destroyUnStealthySamurai();
    }
    
	/**
        Draws this element to the back buffer
        @param dt Time in seconds since the last frame
		@param context The context to draw to
		@param xScroll The global scrolling value of the x axis  
		@param yScroll The global scrolling value of the y axis  
    */
    this.draw = function(dt, canvas, xScroll, yScroll)
    {
        var areaDrawn = [0, 0];
        
        for (var y = 0; y < this.height; y += areaDrawn[1])
        {
            for (var x = 0; x < this.width; x += areaDrawn[0])
            {
                // the top left corner to start drawing the next tile from
				var newPosition = [this.x + x, this.y + y];
				// the amount of space left in which to draw
                var newFillArea = [this.width - x, this.height - y];
				// the first time around you have to start drawing from the middle of the image
				// subsequent tiles alwyas get drawn from the top or left
                var newScrollPosition = [0, 0];
                if (x==0) newScrollPosition[0] = xScroll * this.scrollFactor;
                if (y==0) newScrollPosition[1] = yScroll * this.scrollFactor;
                areaDrawn = this.drawRepeat(canvas, newPosition, newFillArea, newScrollPosition);
            }
        }
    }
    
    this.drawRepeat = function(canvas, newPosition, newFillArea, newScrollPosition)
    {
        // find where in our repeating texture to start drawing (the top left corner)
        var xOffset = Math.abs(newScrollPosition[0]) % this.image.width;
        var yOffset = Math.abs(newScrollPosition[1]) % this.image.height;
        var left = newScrollPosition[0]<0?this.image.width-xOffset:xOffset;
        var top = newScrollPosition[1]<0?this.image.height-yOffset:yOffset;
        var width = newFillArea[0] < this.image.width-left?newFillArea[0]:this.image.width-left;
        var height = newFillArea[1] < this.image.height-top?newFillArea[1]:this.image.height-top;
        
        // draw the image
        canvas.drawImage(this.image, left, top, width, height, newPosition[0], newPosition[1], width, height);
        
        return [width, height];
    }
    
    
}
	
		
		
// Should be split into it's own JS file called unStealthySamurai.js ******************************************************		
function UnStealthySamurai()
{
    /**
        The image that will be displayed by this object
        @type Image
    */
    this.image = null;
    
    /**
        Draws this element to the back buffer
        @param dt Time in seconds since the last frame
		@param context The context to draw to
		@param xScroll The global scrolling value of the x axis  
		@param yScroll The global scrolling value of the y axis  
    */
    this.draw = function(/**Number*/ dt, /**CanvasRenderingContext2D*/ context, /**Number*/ xScroll, /**Number*/ yScroll)
    {
        context.drawImage(this.image, this.x - xScroll, this.y - yScroll);
    }
    
    /**
        Initialises this object
        @param image The image to be displayed
		@param x The position on the X axis
        @param y The position on the Y axis
		@param z The depth
    */
    this.buildUnStealthySamurai = function(/**Image*/ image, /**Number*/ x, /**Number*/ y, /**Number*/ z)
    {
        this.buildSamurai(x, y, z);
        this.image = image;
        return this;
    }
    
    /**
        Clean this object up
    */
    this.destroyUnStealthySamurai = function()
    {
        this.destroySamurai();
    }
}
UnStealthySamurai.prototype = new Samurai();	
SamuraiMural.prototype = new UnStealthySamurai();	


// Should be split into it's own JS file called AnimatedUnStealthySamurai.js ******************************************************		

function AnimatedUnStealthySamurai()
{
    /**
        Defines the current frame that is to be rendered
        @type Number
     */
    this.currentFrame = 0;
	
    /**
        Defines the frames per second of the animation
        @type Number
     */
    this.timeBetweenFrames = 0;
	
	
    /**
        The number of individual frames held in the image
        @type Number
     */
    /**
        Time until the next frame
        @type number
     */
    this.timeSinceLastFrame = 0;
	
    /**
        The width of each individual frame
        @type Number
     */
    this.frameWidth = 0;

    /**
        Initialises this object
        @param image The image to be displayed
		@param x The position on the X axis
        @param y The position on the Y axis
		@param z The depth
        @param frameCount The number of animation frames in the image
        @param fps The frames per second to animate this object at
    */
    this.buildAnimatedUnStealthySamurai = function(/**Image*/ image, /**Number*/ x, /**Number*/ y, /**Number*/ z, /**Number*/ frameCount, /**Number*/ fps)
    {
        if (frameCount <= 0) throw "framecount can not be <= 0";
        if (fps <= 0) throw "fps can not be <= 0"

        this.buildUnStealthySamurai(image, x, y, z);
        this.currentFrame = 0;
        this.frameCount = frameCount;
        this.timeBetweenFrames = 1/fps;
        this.timeSinceLastFrame = this.timeBetweenFrames;
        this.frameWidth = this.image.width / this.frameCount;
    }

    /**
        Draws this element to the back buffer
        @param dt Time in seconds since the last frame
		@param context The context to draw to
		@param xScroll The global scrolling value of the x axis
		@param yScroll The global scrolling value of the y axis
    */
    this.draw = function(/**Number*/ dt, /**CanvasRenderingContext2D*/ context, /**Number*/ xScroll, /**Number*/ yScroll)
    {
        var sourceX = this.frameWidth * this.currentFrame;
        context.drawImage(this.image, sourceX, 0, this.frameWidth, this.image.height, this.x - xScroll, this.y - yScroll, this.frameWidth, this.image.height);

        this.timeSinceLastFrame -= dt;
        if (this.timeSinceLastFrame <= 0)
        {
           this.timeSinceLastFrame = this.timeBetweenFrames;
           ++this.currentFrame;
           this.currentFrame %= this.frameCount;
        }
    }
}

AnimatedUnStealthySamurai.prototype = new UnStealthySamurai;		

// Should be split into it's own JS file called environment.js ******************************************************		

function ApplicationManager()
{
    /**
        Initialises this object
        @return A reference to the initialised object
    */
    this.buildApplicationManager = function()
    {
		this.runner = new AnimatedUnStealthySamurai().buildAnimatedUnStealthySamurai(g_run, 0, 0, 1, 3, 9);
        return this;
    }
}

// Should be split into it's own JS file called utils.js ******************************************************		
Array.prototype.remove = function(/**Number*/ from, /**Number*/ to)
{
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/**
    Removes a specific object from the array
    @param object The object to remove
*/
Array.prototype.removeObject = function(object)
{
    for (var i = 0; i < this.length; ++i)
    {
        if (this[i] === object)
        {
            this.remove(i);
            break;
        }
    }
}	


