const canvas = document.querySelector('canvas');
const [width, height] = [300, 300]

canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

let grid = Array(width).fill().map(
            () => Array(height).fill().map(
                () => { return { a:1, b:0 } }
            ))

for(let x = 130; x < 170; x++) {
    for(let y = 130; y < 170; y++) {
        grid[x][y].b = 1
    }
}

const gridToU8Array = grid => {

    let data = new Uint8ClampedArray( width * height * 4 );

    for( let x = 0; x < width;  x++ ) {
        for( let y = 0; y < height;  y++ ) {
            let i = ((y * width) + x) * 4;
            let c = ((grid[x][y].a - grid[x][y].b) * 255)
            data[ i + 0 ] = c;
            data[ i + 1 ] = c;
            data[ i + 2 ] = c;
            data[ i + 3 ] = 255
        }
    }

    return data

}

const iterate = grid => {

    let next = [];
    let [dA, dB, feed, kill] = [1, .5, .055, 0.062] // difussion rates, feed, kill

    for( let x = 0; x < width;  x++ ) {
        next[x] = [];
        for( let y = 0; y < height;  y++ ) {

            let {a, b} = grid[x][y]

            let laplace = {
                a: (() => {
                    if (x == 0 || x == width-1 || y == 0 || y == height-1 ) return 0;
                    let sum = 0;
                    sum += a * -1 // center
                    sum += (grid[x+1][y].a + grid[x-1][y].a + grid[x][y+1].a + grid[x][y-1].a) * .2 // adjacent
                    sum += (grid[x-1][y-1].a + grid[x+1][y-1].a + grid[x+1][y+1].a + grid[x-1][y-1].a) * .05 // diagonal
                    return sum;
                })(),
                b: (() => {
                    if (x == 0 || x == width-1 || y == 0 || y == height-1 ) return 0;
                    let sum = 0;
                    sum += b * -1 // center
                    sum += (grid[x+1][y].b + grid[x-1][y].b + grid[x][y+1].b + grid[x][y-1].b) * .2 // adjacent
                    sum += (grid[x-1][y-1].b + grid[x+1][y-1].b + grid[x+1][y+1].b + grid[x-1][y-1].b) * .05 // diagonal
                    return sum;
                })()
            }

            let val = {
                a: a + dA * laplace.a - a * (b * b) + feed * (1 - a), 
                b: b + dB * laplace.b + a * (b * b) - (kill + feed) * b
            }

            next[x][y] = {
                a: (val.a < 0) ? 0 : ( val.a > 1 ? 1 : val.a ),
                b: (val.b < 0) ? 0 : ( val.b > 1 ? 1 : val.b )
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
    setTimeout( () => nextFrame(next), 10 );
}

nextFrame(grid);