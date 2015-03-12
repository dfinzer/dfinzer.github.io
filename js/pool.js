$('#viewport').css('background-color', '#000000');

var WORLD_WIDTH = $('#viewport').width();
var WORLD_HEIGHT = $('#viewport').height();
var BALL_RADIUS = 30;
var CUE_BALL_X_START = 0;
var FIRST_BALL_X_START = 2 * WORLD_WIDTH / 3.0;
var FIRST_BALL_Y_START = WORLD_HEIGHT / 2.0;
var ROWS = 5;
var COLORS = ["#D9853B", // orange
              "#74AFAD", // blue
              "#B71427", // red
              "#005A31", // green
              "#FFE658" // yellow
];

var DampenedBody = function(type, options) {
    Physics.body.call(this, type, options);
};
DampenedBody.prototype = Object.create(Physics.body.prototype);

Physics(function( world ) {

    function addBalls() {
        var currentYStart = FIRST_BALL_Y_START;
        for (var i = 0; i < ROWS; i++) {
            var numBallsInRow = i + 1;
            for (var j = 0; j < numBallsInRow; j++) {
                var ball = DampenedBody('circle', {
                    x: FIRST_BALL_X_START + i * BALL_RADIUS * 2,
                    y: currentYStart + j * BALL_RADIUS * 2.2,
                    cof: 0,
                    radius: BALL_RADIUS,
                    styles: {
                        fillStyle: COLORS[(i + j) % 5]
                    }
                });
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
        vx: 2,
        vy: 0,
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
        restitution: 0.05
    }) );

    world.add( Physics.behavior('body-impulse-response') );
    world.add( Physics.behavior('body-collision-detection') );
    world.add( Physics.behavior('sweep-prune') );
});