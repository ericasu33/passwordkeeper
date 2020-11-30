// Verify if URL is valid (not 100% false proof)
const isUrl = str => {
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
};

const url = require('url');

const validation = str => {

  const q = url.parse(str);

  if (q.protocol === "http:" || q.protocol === "https:") {
    if (q.host) {

      return true;
    }


  } else {
    return false;
  }

};

/* $(document).ready(function() {
const editButton = () => {
  $(".edit-url").submit(function(event) {
    event.preventDefault();
    const text = $(".logo-url").val();
    if (text.length === 0) {
      $(".error-container").text("Error: Cannot enter an empty url");
      $(".error-container").show();
    } else if (!isUrl(text)) {
      $(".error-container").text("Error: invalid url");
      $(".error-container").show();
    } else {
      const dataEntry = $(this).serialize();
      $.ajax("organization/:organization_id", {method : 'POST', data: dataEntry})
        .then(() => {
          $(".logo-url").val("");
          $(".error-container").hide();
        });
    }

  });
};
editButton();
}); */

module.exports = {
  isUrl,
};
