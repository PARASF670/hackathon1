var client_id = '3017e66dd65045b0bb6423b18d588a18'
var client_secret = '683296dcce3140418ebfe33cd505da20'
var redirect_uri = 'https:%2F%2Ftender-johnson-06acee.netlify.app%2F'
// var scopes = 'user-read-private user-read-email user-modify-playback-state user-read-playback-position user-libraaming user-read-playback-state user-read-recently-played playlist-read-private'
var auth='https://accounts.spotify.com/authorize'

async function Authenticate() {
    try {
        var respj = await fetch(auth + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri +
            '&response_type=token', { method: 'GET',mode: 'no-cors' })
        var res = await respj.json();
        console.log(res.access_token);
        
    } catch (error) {
        console.log(error);
    }
   
}
Authenticate();