let bulbapediaImages = {};

// When the page loads, issue a background fetch for the image URLs.
$(document).ready(function() {
  let fetching = $.post('/fetchimages');
  
  fetching.done(function(json_data) {
    bulbapediaImages = JSON.parse(json_data);
  });
});