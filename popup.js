window.onload = function() {
  update();
}

function updateAuthorized(authorized) {
  if (authorized) {
    document.getElementById('screen_name').style.display = "block";
    document.getElementById('screen_name').innerHTML = "@" + localStorage.twitter_user;
    document.getElementById('session').innerHTML = "log off";
  } else {
    document.getElementById('screen_name').style.display = "none";
    document.getElementById('session').innerHTML = "log in";
  }
}

function updateTweeting(tweeting) {
  if (tweeting) {
    document.getElementById('tweeting').innerHTML = "tweeting history";
    document.getElementById('tweeting').style.backgroundColor = "#98FB98";
  } else {
    document.getElementById('tweeting').innerHTML = "not tweeting history";
    document.getElementById('tweeting').style.backgroundColor = "#FFF";
  }
}

function update() {
  updateAuthorized(localStorage.authorized == "true");
  updateTweeting(localStorage.tweeting == "true");
}

document.getElementById('screen_name').addEventListener('click', function(){
  chrome.tabs.create({ url: "http://twitter.com/" + localStorage.twitter_user});
});

document.getElementById('session').addEventListener('click', function(){
  if (localStorage.authorized == "true") {
    updateAuthorized(false);
    chrome.runtime.sendMessage({action: "log_off"});
  } else {
    updateAuthorized(true);
    chrome.runtime.sendMessage({action: "log_in"});
  }
});

document.getElementById('tweeting').addEventListener('click', function(){
  updateTweeting( !(localStorage.tweeting == "true") );
  chrome.runtime.sendMessage({action: "toggle_tweet"});
});
