const canvas = document.querySelector('canvas');
const [width, height] = [800, 600]

canvas.width = width;
canvas.height = height;

let grid = Array(height).fill( Array(width).fill( {a:0, b:0} ) )
