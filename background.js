var CONSUMER_KEY = "",
    CONSUMER_SECRET = "";

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://api.twitter.com/oauth/request_token',
  'authorize_url': 'https://api.twitter.com/oauth/authorize',
  'access_url': 'https://api.twitter.com/oauth/access_token',
  'consumer_key': CONSUMER_KEY,
  'consumer_secret': CONSUMER_SECRET,
});

if (localStorage.authorized == undefined){
  localStorage.authorized = false;
  localStorage.tweeting = false;
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.action == "log_in") {
      authorizeUser()
    } else if (message.action == "log_off") {
      logOffUser();
    } else if (message.action == "tweet") {
      if (localStorage.tweeting == "true") {
        tweetPage(sender.tab.url);
      }
    } else if (message.action == "toggle_tweet") {
      toggleTweet();
    }
  }
);

function authorizeUser() {
  oauth.authorize(function(res){
    getUserInfo();
    localStorage.authorized = true;
  });
}

function getUserInfo() {
  var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
  var request = { 'method': 'GET' };

  oauth.sendSignedRequest(url, function(res) {
    var response = JSON.parse(res);
    localStorage.twitter_user = response.screen_name;
    localStorage.twitter_image = response.profile_image_url;
  },request);
}

function logOffUser() {
  oauth.clearTokens();
  localStorage.authorized = false;
  localStorage.tweeting = false;
  localStorage.twitter_user = undefined;
  localStorage.twitter_image = undefined;
}

function toggleTweet() {
  if (localStorage.tweeting == "true") {
    localStorage.tweeting = "false";
  } else {
    localStorage.tweeting = "true";
  }
}

function tweetPage(status) {
  var url = 'https://api.twitter.com/1.1/statuses/update.json';

  var request = {
    'method': 'POST',
    'parameters': {
      'status': status
    }
  };

  oauth.sendSignedRequest(url,
    function(res) {}, request);
}
