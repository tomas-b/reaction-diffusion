const canvas = document.querySelector('canvas');
const [width, height] = [800, 600]

canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

let grid = Array(width).fill().map(
            () => Array(height).fill().map(
                () => { return { a:Math.random(1), b:Math.random(1) } }
            ))

const gridToU8Array = grid => {

    let data = new Uint8ClampedArray( width * height * 4 );

    for( let x = 0; x < width;  x++ ) {
        for( let y = 0; y < height;  y++ ) {
            let i = ((y * width) + x) * 4;
            data[ i + 0 ] = 0
            data[ i + 1 ] = Math.floor(grid[x][y].a * 255)
            data[ i + 2 ] = Math.floor(grid[x][y].b * 255)
            data[ i + 3 ] = 255
        }
    }

    return data

}

const iterate = grid => {

    let next = [];
    for( let x = 0; x < width;  x++ ) {
        next[x] = [];
        for( let y = 0; y < height;  y++ ) {
            next[x][y] = {
                a: grid[x][y].a * 0.8,
                b: grid[x][y].b * 0.95
            }
        }
    }

    return next
}

const nextFrame = grid => {
    let next = iterate(grid);
    let image = new ImageData( gridToU8Array(next), width, height )
    ctx.putImageData( image, 0, 0 );
    grid = next;
    // requestAnimationFrame( nextFrame(next) );
    setTimeout( () => nextFrame(next), 100 );
}

nextFrame(grid);