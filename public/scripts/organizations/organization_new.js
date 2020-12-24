$(document).ready(function() {
  const baseUrl = "https://passwordkeeper-app.herokuapp.com";

  $.ajaxSetup({
    beforeSend: function(xhr, options) {
      options.url = baseUrl + options.url;
    }
  });
  
  const errorOrg = () => {
    return `
      <div class="error-min-input">
        <p> &#9888 Invalid Organization Name. Minimum character length is 1 (one). </p>
      </div>
    `;
  };

  const errorUrl = () => {
    return `
    <div class="invalid-url">
    <p> &#9888 Invalid Url. </p>
    </div>
    `;
  };

  $(".org-input").append(errorOrg(), errorUrl());

  $("#new-add-btn").on("click", function(event) {
    event.preventDefault();
    $(".org-name").focus();
  });

  $(".submit-new").on("submit", function(event) {
    event.preventDefault();
    const orgNameLength = $(".org-name").val().length;
    const urlContent = $(".logo-url").val();
    if (orgNameLength < 1) {
      $(".error-min-input").show();
      $(".org-name").focus();
      return;
    }

    if (urlContent && !isUrl(urlContent)) {
      $(".invalid-url").show();
      $(".logo-url").focus();
      return;
    }

    $.ajax({
      method: "POST",
      url: "/organizations",
      data: $(".submit-new").serialize(),
    })
      .then(function() {
        window.location.replace('/organizations');
      })
      .catch(err => {
        console.log("Error", err);
      });
  });

  // Remove error message once validation passes
  $(".org-name").on("input", function() {
    const orgNameLength = $(".org-name").val().length;

    if (orgNameLength > 0) {
      $(".invalid-url, .error-min-input").hide();
    }
  });

  $(".logo-url").on("input", function() {
    const urlLength = $(".logo-url").val().length;

    if (urlLength > 0) {
      $(".invalid-url, .error-min-input").hide();
    }
  });
});


