function post( url, data )
{
    return fetch( url, {
        method: 'POST',
        body: JSON.stringify( data )
    } ).then( async ( response ) =>
    {
        if( !response.ok )
        {
            throw await response.json();
        }
        else
        {
            return response.json();
        }
    } );
}