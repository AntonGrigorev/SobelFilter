var canvas = document.getElementById('sobel');
var context = canvas.getContext('2d');


var image = new Image(); 
image.crossOrigin = 'anonymous';
image.onload = drawImage;

function drawImage(event) {
	var width = image.width;
	var height = image.height;

	canvas.width = width;
	canvas.height = height;
	
	context.drawImage(image, 0, 0);
	var imageData = context.getImageData(0, 0, width, height);

	var sobelData = Sobel(imageData);
	var sobelImageData = context.createImageData(width, height);
    sobelImageData.data.set(sobelData);
    context.putImageData(sobelImageData, 0, 0);
}

image.src = 'photo.jpg';

function Sobel(imageData) {
    var width = imageData.width;
    var height = imageData.height;

    var kernelX = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    var kernelY = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];
	
	 function bindPixelAt(data) {
	  var width = imageData.width;
      var height = imageData.height;
      return function(x, y, i) {
        i = i || 0;
        return data[((width * y) + x) * 4 + i];
      };
    }

    var sobelData = [];
    var grayscaleData = [];

    var data = imageData.data;
    var pixelAt = bindPixelAt(data);
    var x, y;

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var r = pixelAt(x, y, 0);
        var g = pixelAt(x, y, 1);
        var b = pixelAt(x, y, 2);

        var avg = (r + g + b) / 3;
        grayscaleData.push(avg, avg, avg, 255);
      }
    }

    pixelAt = bindPixelAt(grayscaleData);

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var pixelX = (
            (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
            (kernelX[0][1] * pixelAt(x, y - 1)) +
            (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
            (kernelX[1][0] * pixelAt(x - 1, y)) +
            (kernelX[1][1] * pixelAt(x, y)) +
            (kernelX[1][2] * pixelAt(x + 1, y)) +
            (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
            (kernelX[2][1] * pixelAt(x, y + 1)) +
            (kernelX[2][2] * pixelAt(x + 1, y + 1))
        );

        var pixelY = (
          (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
          (kernelY[0][1] * pixelAt(x, y - 1)) +
          (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
          (kernelY[1][0] * pixelAt(x - 1, y)) +
          (kernelY[1][1] * pixelAt(x, y)) +
          (kernelY[1][2] * pixelAt(x + 1, y)) +
          (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
          (kernelY[2][1] * pixelAt(x, y + 1)) +
          (kernelY[2][2] * pixelAt(x + 1, y + 1))
        );

        var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;

        sobelData.push(magnitude, magnitude, magnitude, 255);
      }
    }
	return sobelData;
}