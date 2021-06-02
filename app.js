var client_id = "";
var client_secret = "";
var redirect_uri = "http://127.0.0.1:5500/index.html";
var auth = "https://accounts.spotify.com/authorize";
const token = "https://accounts.spotify.com/api/token";
var playback = "https://api.spotify.com/v1/me/playlists";
par = document.getElementById("playcard");
raw = document.createElement("div");
raw.setAttribute("class", "row");
par.append(raw);

function Authenticate() {
  localStorage.clear();
  client_id = document.getElementById("clientId").value;
  client_secret = document.getElementById("clientSecret").value;
  localStorage.setItem("client_id", client_id);
  localStorage.setItem("client_secret", client_secret);

  let url = auth;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url;
}

function Load() {
  client_id = document.getElementById("clientId").value;
  client_secret = document.getElementById("clientSecret").value;
  if (window.location.search.length > 0) {
    Redirect();
  }
}

function Redirect() {
  let code = getCode();
  GetToken(code);
  window.history.pushState("", "", redirect_uri);
}
function getCode() {
  let code = null;
  const queryString = window.location.search;
//   console.log(queryString);
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get("code");
  }
  return code;
}
function GetToken(code) {
  let data = "grant_type=authorization_code";
  data += "&code=" + code;
  data += "&redirect_uri=" + encodeURI(redirect_uri);
  data += "&client_id=" + client_id;
  data += "&client_secret=" + client_secret;
  callAuthorizationApi(data);
}
function callAuthorizationApi(data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", token, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " + btoa(client_id + ":" + client_secret)
  );
  xhr.send(data);
  xhr.onload = handleAuthorizationResponse;
}
function handleAuthorizationResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    // console.log(data);
    var data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      access_token = data.access_token;
      localStorage.setItem("access_token", access_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);
    }
    document.getElementById("playlistbtn").disabled = false;
    Load();
  } else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}

function refreshPlaylist() {
  callApi("GET", playback, null, handlePlaylistResponse);
}

function callApi(method, url, body, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + access_token);
  xhr.send(body);
  xhr.onload = callback;
}
function handlePlaylistResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    removeAllItems("presentdata");
    ShowPlaylist(data);
  } else if (this.status == 401) {
    refreshAccessToken();
  } else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}
function removeAllItems(elementId) {
  let node = document.getElementById(elementId);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
function ShowPlaylist(data) {
    var x = document.getElementById("playcard").childElementCount;
    console.log(x+1);
    for (i in data.items) {
        
        createcard(data.items[i].name,data.items[i].images[0].url);
    }
  
}

function createcard(name, playlistimage='') {
  col = document.createElement("div");
  col.setAttribute("class", "col-lg-4 col-sm-12");
  card = document.createElement("div");
  card.setAttribute("class", "card");
  chead = document.createElement("div");
  chead.setAttribute("class", "card-header");
  chead.style.backgroundColor = "black";
  chead.style.color = "white";
  chead.style.textAlign = "center";
  chead.innerText = name;
  cbody = document.createElement("div");
  cbody.setAttribute("class", "card-body");
  cbody.style.textAlign = "center";
  image = document.createElement('img');
    image.setAttribute("class", "card-img");
    image.setAttribute('src',playlistimage)
    
  // content = document.createElement('div');
  // content.innerHTML = "Go: " + playlistlink;
  //    btn = document.createElement('button');
  // btn.setAttribute("class", "btn btn-primary ");

  // btn.innerHTML = "Click for Weather";
  cbody.append(image);
  card.append(chead, cbody);
  col.append(card);
  raw.append(col);

  document.body.append(par);
  // btn.setAttribute("id", code);
  // document.getElementById(code).addEventListener("click", function () {
  //     myFunction(latitude);
  // })
}
