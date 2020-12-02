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

  const errorTransfer = () => {
    return `
    <div class="invalid-transfer">
    <p> &#9888 Ownership has not been changed. Please input the correct information.</p>
    </div>
    `;
  };

  $("#submit-user").append(errorEmail(), errorUser());
  $(".ownership-error").append(errorTransfer());
  $(".email-url").focus();

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
        window.location.replace(window.location.pathname);
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
    console.log(emailLength);

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
          const postUrl = this.$target.attr("action");
          return $.ajax({
            method: "DELETE",
            url: postUrl,
          })
            .then(function() {
              window.location.replace(window.location.pathname);
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
    columnClass: "col-md-8 col-md-offset-2",
    content:
    '<p> Only users within this organization can be transferred ownership. </p>' +
    '<p> &#9888 NOTE: Once ownership is transferred, you will no longer have access to this page. </p>' +
    '<form id="transfer-details" method="POST" action="/organizations/<%= organization.organization_id %>/transfer?_method=PUT">' +

    '<div class="form-group">' +
    '<label for="user_id">User ID' +
    '<input class="form-control form-control-lg user_id" type="text" name="user_id" required>' +
    '</label>' +
    '</div>' +

    '<div class="form-group">' +
    '<label for="user_name">User Name' +
    '<input class="form-control form-control-lg user_name" type="text" name="user_name" required>' +
    '</div>' +

    '<div class="form-group">' +
    '<label for="email">User Email' +
    '<input class="form-control form-control-lg email" type="email" name="email" required>' +
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
              $(".invalid-transfer").show();
            });
        },
      },
      cancel: {
        keys:["esc"],
      },
    },
    onContentReady: function() {
      const jc = this;
      const transferButton = this.$target;
      console.log(transferButton);

      transferButton.on('click', function() {
        $(".invalid-transfer").hide();
      });

      this.$content.find('form').on('submit', function(event) {
        event.preventDefault();

        jc.$$transfer.trigger('click');
      });
    }
  });

});

