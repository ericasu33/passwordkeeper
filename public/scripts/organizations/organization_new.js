$(document).ready(function() {
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

  $('.logo-url').on("change",function() {
    const fileInput = $(this);
    if (fileInput.length && fileInput[0].files && fileInput[0].files.length) {
      const url = window.URL || window.webkitURL;
      const image = new Image();
      image.onload = function() {
        alert('Valid Image');
      };
      image.onerror = function() {
        $(".invalid-url").show();
        $(".org-name").focus();
        return;
      };
      image.src = url.createObjectURL(fileInput[0].files[0]);
    }
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




