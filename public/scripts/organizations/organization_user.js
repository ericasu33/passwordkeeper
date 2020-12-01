$(document).ready(function() {
  const errorEmail = () => {
    return `
    <div class="invalid-email">
    <p> &#9888 Invalid Email. </p>
    </div>
    `;
  };

  const errorUser = () => {
    return `
    <div class="error-user">
    <p> &#9888 User is either not registered or is already in the organization. </p>
    </div>
    `;
  };

  $("#submit-user").append(errorEmail(), errorUser());
  $(".email-url").focus();


  // Add User
  $("#submit-user").on("submit", function(event) {
    event.preventDefault();
    
    const emailContent = $(".email-url").val();

    if (!emailContent || !isEmail(emailContent)) {
      $(".invalid-email").show();
      $(".email-url").focus();
      return;
    }

    $.ajax({
      method: "PUT",
      url: window.location.pathname,
      data: $("#submit-user").serialize(),
    })
      .then(function() {
        window.location.replace(window.location.pathname);
      })
      .catch(err => {
        $(".error-user").show();
      });
  });

  // Remove error message once validation passes
  $(".email-url").on("input", function() {
    const emailLength = $(".email-url").val().length;

    if (emailLength > 0) {
      $(".invalid-email").hide();
    }
  });

  // Delete User
  $(".del-user-confirm").confirm({
    icon: 'fa fa-warning',
    title: "Remove User",
    content: "Are you sure you would like to remove this user?",
    type: "red",
    buttons: {
      Remove: {
        btnClass: "btn-danger",
        action: function() {
          const postUrl = $(".del-user-confirm").attr("action");
          return $.ajax({
            method: "POST",
            url: postUrl,
          })
            .then(function() {
              window.location.replace(window.location.pathname);
            });
        }
      },
      Cancel:{
        keys:["esc"],
      },
    }
  });
});

