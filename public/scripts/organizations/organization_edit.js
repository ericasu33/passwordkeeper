$(document).ready(function() {
  const baseUrl = "https://passwordkeeper-app.herokuapp.com/";
  
  $.ajaxSetup({
    beforeSend: function(xhr, options) {
      options.url = baseUrl + options.url;
    }
  });

  // Edit Organization Details
  const errorUrl = () => {
    return `
    <div class="invalid-url">
    <p> &#9888 Invalid Url. </p>
    </div>
    `;
  };

  $("#edit-org").append(errorUrl());
  // $(".org-name").focus();

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
      $(".logo-url").val("");
      $(".logo-url").focus();
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
  
    if (urlLength >= 0) {
      $(".invalid-url").hide();
    }
  });

  // Delete Organization
  $(".del-org-confirm").confirm({
    icon: 'fa fa-warning',
    title: "Delete Organization",
    content: "Are you sure you would like to delete the organization?",
    type: "red",
    buttons: {
      Delete: {
        btnClass: "btn-danger",
        action: function() {
          const postUrl = $(".del-org-confirm").parent().attr("action");
          return $.ajax({
            method: "POST",
            url: postUrl,
          })
            .then(function() {
              window.location.replace("/organizations");
            });
        }
      },
      Cancel:{
        keys:["esc"],
      },
    }
  });
});