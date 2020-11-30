const isUrl = str => {
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
};


$(document).ready(function() {
  console.log("Heloooooooo");
  const editButton = () => {
    $(".edit-url").submit(function(event) {
      event.preventDefault();
      const text = $(".logo-url").val();
      console.log("Text Value", text);
      if (text.length === 0) {
        $(".error-container").text("Error: Cannot enter an empty url");
        $(".error-container").show();
      } else if (isUrl(text) === false) {
        $(".error-container").text("Error: invalid url");
        $(".error-container").show();
      }

    });
  };
  editButton();
});



<script type="text/javascript" src="about.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

