function make_color( red, green, blue )
{
    return { red, green, blue };
}

const GRADIENT = [
    make_color(   0, 255, 0 ),
    make_color( 255, 255, 0 ),
    make_color( 255, 165, 0 ),
    make_color( 255,   0, 0 )
];

function getBackgroundColor( score )
{
    let colorIndex = Math.floor( score * ( GRADIENT.length - 1 ) );
    let color1 = GRADIENT[ colorIndex ];
    let color2 = GRADIENT[ colorIndex + 1 ];
    let w1 = 1 - score;
    let w2 = score;
    let red   = color1.red   * w1 + color2.red   * w2;
    let green = color1.green * w1 + color2.green * w2;
    let blue  = color1.blue  * w1 + color2.blue  * w2;
    return `rgb( ${red.toFixed( 0 )}, ${green.toFixed( 0 )}, ${blue.toFixed( 0 )} )`;
}

chrome.runtime.onMessage.addListener( ( message ) =>
{
    let scoreDiv = document.createElement( 'div' );
    scoreDiv.textContent = ( message.score * 100 ).toFixed( 2 );
    scoreDiv.classList.add( 'get-some-perspective-score', 'get-some-perspective-fade-out' );
    scoreDiv.style.backgroundColor = getBackgroundColor( message.score );
    scoreDiv.addEventListener( 'animationend', ( event ) =>
    {
        scoreDiv.remove();
    } );
    scoreDiv.addEventListener( 'mouseenter', ( event ) =>
    {
        scoreDiv.classList.remove( 'get-some-perspective-fade-out' );
    } );
    scoreDiv.addEventListener( 'mouseleave', ( event ) =>
    {
        scoreDiv.classList.add( 'get-some-perspective-fade-out' );
    } );
    document.body.appendChild( scoreDiv );
} );