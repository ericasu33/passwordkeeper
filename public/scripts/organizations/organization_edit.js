$(document).ready(function() {
  const errorUrl = () => {
    return `
    <div class="invalid-url">
    <p> &#9888 Invalid Url. </p>
    </div>
    `;
  };

  $("#edit-org").append(errorUrl());
  $(".org-name").focus();

  $("#submit-edit").on("submit", function(event) {
    event.preventDefault();

    const orgNameLength = $(".org-name").val().length;
    const urlContent = $(".logo-url").val();

    if (orgNameLength < 1 && !urlContent) {
      $(".invalid-url").show();
      return;
    }

    if (urlContent && !isUrl(urlContent)) {
      $(".invalid-url").show();
      $("#logo-url").focus();
      return;
    }
    
    $.ajax({
      method: "POST",
      url: window.location.pathname,
      data: $("#submit-edit").serialize(),
    })
      .then(function() {
        window.location.replace(window.location.pathname);
      });
  });

  // Remove error message once validation passes
  $(".org-name").on("input", function() {
    const orgNameLength = $(".org-name").val().length;
  
    if (orgNameLength > 0) {
      $(".error-min-input").hide();
    }
  });

  $(".logo-url").on("input", function() {
    const urlLength = $(".logo-url").val().length;
  
    if (urlLength > 0) {
      $(".error-min-input").hide();
    }
  });
});