const CONTEXT_MENU_ID = 'context_menu';

chrome.runtime.onInstalled.addListener( ( details ) =>
{
    let version = chrome.runtime.getManifest().version;
    if( details.reasony === 'install' )
    {
        console.log( 'Installing version', version );
    }
    else if( details.reason === 'update' )
    {
        console.log( 'Updating to version', version );
    }
    else
    {
        console.log( 'Not installing or updating:', details );
    }

    let contextMenu = {
        id: CONTEXT_MENU_ID,
        title: 'Get Some Perspective',
        contexts: [ 'selection' ]
    };
    chrome.contextMenus.create( contextMenu, () =>
    {
        if( chrome.runtime.lastError )
        {
            console.error( 'An error occurred creating context menu:', chrome.runtime.lastError );
        }
    } );
} );

chrome.contextMenus.onClicked.addListener( ( info, tab ) =>
{
    post( 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyDm2hIE_EMpFlfCIH-99c9GnA5RBXuaGe0', {
        comment: { text: info.selectionText },
        languages: [ 'en' ],
        requestedAttributes: { TOXICITY: { } }
    } )
        .then( ( data ) =>
        {
            console.log( 'Perspective:', ( data.attributeScores.TOXICITY.summaryScore.value * 100 ) + '%', info.selectionText );
            chrome.tabs.sendMessage( tab.id, { score: data.attributeScores.TOXICITY.summaryScore.value } );
        } )
        .catch( ( error ) =>
        {
            console.error( 'Perspective:', error );
        } );
} );