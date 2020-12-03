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

  // Add User
  $("#submit-user").on("submit", function(event) {
    event.preventDefault();

    const emailContent = $(".email-url").val();

    if (!emailContent || !isEmail(emailContent)) {
      $(".invalid-email").show();
      $(".email-url").val("");
      $(".email-url").focus();
      return;
    }

    const postUrl = $("#submit-user").attr("action");
    $.ajax({
      method: "PUT",
      url: postUrl,
      data: $("#submit-user").serialize(),
    })
      .then(function() {
        window.location.reload();
        window.location.replace(window.location.pathname + "#usertable");
      })
      .catch(err => {
        $(".error-user").show();
        $(".email-url").val("");
        $(".email-url").focus();
      });
  });

  // Remove error message once validation passes
  $(".email-url").on("input", function() {
    const emailLength = $(".email-url").val().length;

    if (emailLength > 0) {
      $(".invalid-email").hide();
      $(".error-user").hide();
    }
  });

  // Delete User
  $(".del-user-confirm").confirm({
    icon: 'fa fa-warning',
    title: "Remove User",
    content: "Are you sure you would like to remove this user?",
    type: "red",
    buttons: {
      remove: {
        btnClass: "btn-danger",
        action: function() {
          const postUrl = this.$target.parent().attr("action");
          return $.ajax({
            method: "DELETE",
            url: postUrl,
          })
            .then(function() {
              window.location.replace(window.location.pathname);
            })
            .catch(err => {
              console.log("Error", err);
            });
        }
      },
      cancel:{
        keys:["esc"],
      },
    }
  });

  // Transfer Ownership
  $(".transfer-ownership").confirm({
    title: "Organization Ownership",
    type: "red",
    theme: "my-theme",
    columnClass: "col-md-8 col-md-offset-2",
    content:
    '<p> Only users within this organization can be transferred ownership. </p>' +
    '<p class="small-font"><span class="warning"> &#9888 NOTE: </span> Once ownership is transferred, you will no longer have access to this page. </p>' +
    '<form id="transfer-details" method="POST" action="/organizations/<%= organization.organization_id %>/transfer?_method=PUT">' +

    '<div class="form-group">' +
    '<label for="user_id">User ID' +
    '<input class="form-control form-control-lg user_id" type="text" name="user_id" placeholder="required" required>' +
    '</label>' +
    '</div>' +

    '<div class="form-group">' +
    '<label for="user_name">User Name' +
    '<input class="form-control form-control-lg user_name" type="text" name="user_name" placeholder="required" required>' +
    '</div>' +

    '<div class="form-group">' +
    '<label for="email">User Email' +
    '<input class="form-control form-control-lg email" type="email" name="email" placeholder="required" required>' +
    '</div>' +
    '</form>',
    buttons: {
      transfer: {
        text: "Transfer",
        btnClass: "btn-danger",
        action: function() {
          const id = this.$content.find('.user_id').val();
          const name = this.$content.find('.user_name').val();
          const email = this.$content.find('.email').val();

          if (!id || !name || !email) {
            $.alert('Please fill in all the fields');
            return false;
          }

          $.ajax({
            method: "PUT",
            url: window.location.pathname + "/transfer?_method=PUT",
            data: $("#transfer-details").serialize(),
          })
            .then(function() {
              window.location.replace("/organizations");
            })
            .catch(err => {
              this.setContentAppend('<span class="warning invalid-transfer"> ERROR: &#9888 Please input the correct information.</span>');

              this.$content.find('input').val("");
            });
          return false;
        },
      },
      cancel: {
        keys:["esc"],
      },
    },
    onContentReady: function() {
      const jc = this;
      this.$content.find('input').on('input', function() {
        const inputLength = $(this).val().length;

        if (inputLength > 0) {
          const errorMsg = jc.$content.find("span");
          errorMsg.remove();
        }
      });
    }

  });

});
