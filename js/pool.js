$('#viewport').css('background-color', '#000000');

var WORLD_WIDTH = window.innerWidth - 20;
var WORLD_HEIGHT = window.innerHeight - 20;
var BALL_RADIUS = Math.min(WORLD_WIDTH, WORLD_HEIGHT) / 20.0;
var CUE_BALL_X_START = 0;
var FIRST_BALL_X_START = WORLD_WIDTH / 2.0;
var FIRST_BALL_Y_START = WORLD_HEIGHT / 2.0;
var ROWS = 5;
var COLORS = ["#D9853B", // orange
              "#74AFAD", // blue
              "#B71427", // red
              "#005A31", // green
              "#FFE658" // yellow
];
var IMAGES = [
    {
        'link': "http://www.twitter.com/dfinzer",
        'image': 'twitter-ball.svg'
    },
    {
        'link': "https://soundcloud.com/devin-finzer/",
        'image': 'soundcloud-ball.svg'
    },
    {
        'link': "http://pinterest.com/dfinzer",
        'image': 'pinterest-ball.svg'
    },
    {
        'link': "https://medium.com/@devinfinzer",
        'image': 'medium-ball.svg'
    },
    {
        'link': "https://www.linkedin.com/profile/view?id=55525353",
        'image': 'linkedin-ball.svg'
    }
];


Physics(function( world ) {

    function addBalls() {
        var currentYStart = FIRST_BALL_Y_START;
        for (var i = 0; i < ROWS; i++) {
            var numBallsInRow = i + 1;
            for (var j = 0; j < numBallsInRow; j++) {
                var ball = Physics.body('circle', {
                    x: FIRST_BALL_X_START + i * BALL_RADIUS * 2,
                    y: currentYStart + j * BALL_RADIUS * 2.2,
                    cof: 0,
                    radius: BALL_RADIUS,
                    styles: {
                        fillStyle: COLORS[(i + j) % 5]
                    },
                    restitution: 0.8
                });
                ball.view = new Image();
                var imageData = IMAGES[(i + j) % 5];
                ball.view.src = 'images/' + imageData['image'];
                ball.view.width = BALL_RADIUS * 2;
                ball.view.height = BALL_RADIUS * 2;
                ball.view.href = imageData['link'];
                world.add(ball);
            }
            currentYStart -= BALL_RADIUS;
        }
    }
    addBalls();

    var renderer = Physics.renderer('canvas', {
        el: 'viewport', // id of the canvas element
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT
    });
    world.add(renderer);

    var cueBall = Physics.body('circle', {
        x: CUE_BALL_X_START,
        y: FIRST_BALL_Y_START,
        vx: 30,
        vy: .1,
        cof: 0,
        radius: BALL_RADIUS,
        styles: {
            fillStyle: '#FFFFFF'
        }
    });
    world.add(cueBall);

    world.render();

    Physics.util.ticker.on(function( time, dt ){
        world.step( time );
    });

    // start the ticker
    Physics.util.ticker.start();

    world.on('step', function(){
        world.render();
    });

    var bounds = Physics.aabb(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    world.add(Physics.behavior('edge-collision-detection', {
        aabb: bounds,
        restitution: 0.1
    }) );

    world.add( Physics.behavior('body-impulse-response') );
    world.add( Physics.behavior('body-collision-detection'), {
        restitution: 0.1
    });
    world.add( Physics.behavior('sweep-prune') );

    $("#viewport").click(function(evt) {
        var clickedBall = world.findOne({$at: Physics.vector(evt.offsetX, evt.offsetY)});
        if (clickedBall) {
            var link = clickedBall.view.href;
            var win = window.open(link, '_blank');
            win.focus();
        }
    });
    $("#viewport").mousemove(function(evt) {
        var focusedBall = world.findOne({$at: Physics.vector(evt.offsetX, evt.offsetY)});
        if (focusedBall) {
            $('html,body').css('cursor','pointer');
        } else {
            $('html,body').css('cursor','default');
        }
    });
});