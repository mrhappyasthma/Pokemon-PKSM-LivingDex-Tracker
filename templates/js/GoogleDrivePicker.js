var pickerAPIKey = "";
var clientId = "";
var projectId = "";

window.addEventListener('load', (event) => {
  fetch("static/google_picker_api_key.txt")
    .then( response => response.text() )
      .then( text => pickerAPIKey = text );
  fetch("static/client_secret.txt")
    .then( response => response.text() )
      .then( text => clientId = text );
  fetch("static/project_number.txt")
    .then( response => response.text() )
      .then( text => projectId = text );
});
    
const scope = 'https://www.googleapis.com/auth/drive';
    
var oauthToken = null;
var pickerApiLoaded = false;

function loadPicker() {
  if (pickerApiLoaded && oauthToken) {
    createPicker();
  } else {
    gapi.load('auth', {'callback': onAuthApiLoad});
    gapi.load('picker', {'callback': onPickerApiLoad});
    gapi.load('client', {'callback': onClientApiLoad});
  }
}

function onClientApiLoad() {
  gapi.client.init({
    clientId: clientId,
    scope: scope
  })
}

function onAuthApiLoad() {
  window.gapi.auth.authorize({
    'client_id': clientId,
    'scope': scope,
    'immediate': false
   },
   handleAuthResult);
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult) {
  if (!authResult || authResult.error) {
    console.log('Authentication error: ' + authResult.error);
    return;
  }
  oauthToken = authResult.access_token;
  createPicker();
}

/** This function is called by two async APIs. It will only trigger by the latter of the two. */
function createPicker() {
  if (pickerApiLoaded && oauthToken) {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes('application/octet-stream');
    view.setQuery("*.bnk", ".bin");
    const picker =
        new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setAppId(projectId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(pickerAPIKey)
            .setCallback(pickerCallback)
            .build()
    picker.setVisible(true);
  }
}

function pickerCallback(data) {
  if (data.action != google.picker.Action.PICKED) {
    console.log('Invalid picker action: ' + data.action);
    return;
  }
  downloadFileWithID(data.docs[0].id, handleFile);
}

function handleFile(contents) {
  if (!contents) {
    return;
  }
  const bankFileLoadedEvent = new CustomEvent('bankFileLoaded', { detail: contents });
  window.dispatchEvent(bankFileLoadedEvent);
}

/**
 * Download a file's metadata from a given FileID.
 *
 * @param {String} file_id Drive File id.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFileWithID(file_id, callback) {
  if (file_id && callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json"
    const URL = 'https://www.googleapis.com/drive/v2/files/' + file_id;
    xhr.open('GET', URL);
    xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
    xhr.onload = function() {
      downloadFile(xhr.response, callback);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

/**
 * Download a drive file's content. Excepts a json object from the drive v2 API.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(file, callback) {
  if (!file.downloadUrl) {
    console.log('Could not parse file:');
    console.log(file);
    callback(null);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.responseType = "arraybuffer";
  xhr.open('GET', file.downloadUrl);
  xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
  xhr.onload = function() {
    callback(xhr.response);
  };
  xhr.onerror = function() {
    callback(null);
  };
  xhr.send();
}