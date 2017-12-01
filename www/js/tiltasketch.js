//Big ups for crisping my lines, great blog:http://www.ntaso.com/how-to-draw-sharp-lines-on-a-html5-canvas-for-retina-displays/
//Big ups for keeping the screen LIT while idle: https://github.com/richtr/NoSleep.js
//Big ups to hammerjs for making screen gestures nice: https://github.com/hammerjs/hammer.js
var my_canvas = document.getElementById('bcanvas');
var context = my_canvas.getContext("2d");
var noSleep = new NoSleep();
    noSleep.enable();
var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var deviceHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;

var is_iPad = navigator.userAgent.match(/iPad/i) != null;
var is_iPhone = navigator.userAgent.match(/iPhone/i) != null;

var pixelRatio = Math.round(window.devicePixelRatio) || 1;
// we're working with all available pixels, i. e. 750x1334 on an iPhone 7
var width = deviceWidth * pixelRatio;
var height = (deviceHeight * pixelRatio) - 407;//Minus 107 hack to fit the whole visible canvas of the iphones

//set the height of the canvas container
if(is_iPad){
$("#canvas_container").css("height", deviceHeight - $('.row .row').eq(0).height() - $('.row .row').eq(1).height()*3 - ($('.navbar-header').eq(0).height() * 3));
$('.circle').css("height", deviceWidth / 6);
$('.circle').css("width", deviceWidth / 6);
$('.circle').css("margin", "auto");
} else if(is_iPhone) {
    $("#canvas_container").css("height", deviceHeight - $('.row .row').eq(0).height() - $('.row .row').eq(1).height() * 3 - ($('.navbar-header').eq(0).height() * 3));
    $('.circle').css("height", deviceWidth / 3);
    $('.circle').css("width", deviceWidth / 3);
    $('.circle').css("margin", "auto");
} else {
    $("#canvas_container").css("height", deviceHeight - $('.row .row').eq(0).height() - $('.row .row').eq(1).height() * 3 - ($('.navbar-header').eq(0).height() * 6));
    $('.circle').css("height", deviceWidth / 12);
    $('.circle').css("width", deviceWidth / 12);
    $('.circle').css("margin", "auto");

}


// here's the magic: the actual canvas has the same pixels as the device (iPhone 7 in this case)
my_canvas.width = width;
my_canvas.height = height;

// however, the canvas dimensions are set to the pixels we're working with in the browser.
my_canvas.style.width = Math.round(width / pixelRatio) + "px";
my_canvas.style.height = Math.round(height / pixelRatio) + "px";


var centerX = my_canvas.width / 2;
var centerY = my_canvas.height / 2;

var start = centerX;
var end = centerY;

var pressed = 0;

//context global variables
context.strokeStyle = '#363534';
context.lineWidth = 1;

var leftControl = document.getElementById('left');
var rightControl = document.getElementById('right');

var left = new Hammer(leftControl);
var right = new Hammer(rightControl);

left.get('pan').set({ direction: Hammer.DIRECTION_ALL });
right.get('pan').set({ direction: Hammer.DIRECTION_ALL });
function canvasToImage(backgroundColor) {
    //cache height and width		
    var w = my_canvas.width;
    var h = my_canvas.height;

    var data;

    if (backgroundColor) {
        //get the current ImageData for the canvas.
        data = context.getImageData(0, 0, w, h);

        //store the current globalCompositeOperation
        var compositeOperation = context.globalCompositeOperation;

        //set to draw behind current content
        context.globalCompositeOperation = "destination-over";

        //set background color
        context.fillStyle = backgroundColor;

        //draw background / rect on entire canvas
        context.fillRect(0, 0, w, h);
    }

    //get the image data from the canvas
    var imageData = my_canvas.toDataURL('image/png');

    if (backgroundColor) {
        //clear the canvas
        context.clearRect(0, 0, w, h);

        //restore it with original / cached ImageData
        context.putImageData(data, 0, 0);

        //reset the globalCompositeOperation to what it was
        context.globalCompositeOperation = compositeOperation;
    }

    //return the Base64 encoded data url string
    return imageData;
}

$("button").click(function (e) {
    //CANVAS FRAME
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(my_canvas.width, 0);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 16;
    context.stroke();

    context.beginPath();
    context.moveTo(my_canvas.width, 0);
    context.lineTo(my_canvas.width, my_canvas.height);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 16;
    context.stroke();

    context.beginPath();
    context.moveTo(my_canvas.width, my_canvas.height);
    context.lineTo(0, my_canvas.height);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 100;
    context.stroke();

    context.beginPath();
    context.moveTo(0, my_canvas.height);
    context.lineTo(0, 0);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 16;
    context.stroke();

    //CANVAS KNOBS
    //LEFT
    context.beginPath();
    context.arc(100, my_canvas.height - 25, 20, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
    //RIGHT
    context.beginPath();
    context.arc(my_canvas.width - 100, my_canvas.height - 25, 20, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();

    //LOGO
    context.font = "30px Arial";
    context.fillStyle = "gold";
    context.fillText("Swipe-A-Sketch", (my_canvas.width / 2) - 100, my_canvas.height - 15);
    //make an image out of the canvas 
    var img = new Image();
    img.alt = "Press and hold image to save to your camera roll";
    img.src = canvasToImage("#ADACA8");
    //$('body').prepend(img);

    $.magnificPopup.open({
        items: {
            src: img.src
        },
        type: 'image'
    });
    $(".mfp-title").html("Press and hold image to save to your camera roll");
});


left.on("panleft", function (e) {

    context.beginPath();

    // Important: always offset by half a pixel to make lines super crisp
    context.moveTo(start + 0.5, end + 0.5);
    end += 2;

    context.lineTo(start + 0.5, end + 0.5);
    context.closePath();
    context.stroke();
    context.restore();
});

left.on("panright", function (e) {

    context.beginPath();

    // Important: always offset by half a pixel to make lines super crisp
    context.moveTo(start + 0.5, end + 0.5);
    end -= 2;

    context.lineTo(start + 0.5, end + 0.5);
    context.closePath();
    context.stroke();
    context.restore();
});

right.on("panright", function (e) {

    context.beginPath();

    // Important: always offset by half a pixel to make lines super crisp
    context.moveTo(start + 0.5, end + 0.5);
    start += 2;

    context.lineTo(start + 0.5, end + 0.5);
    context.closePath();
    context.stroke();
    context.restore();
});

right.on("panleft", function (e) {

    context.beginPath();

    // Important: always offset by half a pixel to make lines super crisp
    context.moveTo(start + 0.5, end + 0.5);
    start -= 2;

    context.lineTo(start + 0.5, end + 0.5);
    context.closePath();
    context.stroke();
    context.restore();
});

if (typeof window.DeviceMotionEvent != 'undefined') {
    // Shake sensitivity (a lower number is more)
    var sensitivity = 20;

    // Position variables
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;

    // Listen to motion events and update the position
    window.addEventListener('devicemotion', function (e) {
        x1 = e.accelerationIncludingGravity.x;
        y1 = e.accelerationIncludingGravity.y;
        z1 = e.accelerationIncludingGravity.z;
    }, false);

    // Periodically check the position and fire
    // if the change is greater than the sensitivity
    setInterval(function () {
        var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

        if (change > sensitivity) {
           context.clearRect(0, 0, my_canvas.width, my_canvas.height);
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
    }, 150);
}
