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

  /* const catImage = () => {
    console.log("MEOOWWWWWWW");
    return `<img class="cat" src="https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512" alt="default cat picture"`;
  };
 */
  /* $(".default-img").append(catImage()); */

  $("#new-org").append(errorOrg(), errorUrl());

  $("#new-add-btn").on("click", function(event) {
    event.preventDefault();
    $(".org-name").focus();
  });

  $(".submit-new").on("submit", function(event) {
    event.preventDefault();
    const orgNameLength = $(".org-name").val().length;
    const urlContent = $(".logo-url").val();
    /* if ($(".logo-url").val() === "") {
      alert("hereee");
      $(".logo-url").val("https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512");
    }
    alert($(".logo-url").val()); */
    /* et urlContent = $(".logo-url").val(); */

    if (orgNameLength < 1) {
      $(".error-min-input").show();
      $(".org-name").focus();
      return;
    }
    /* if (urlContent === "") {
      alert("insiddeee");
      urlContent = "https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512";
    } else {
      alert("hiiiiiiiii", urlContent);
    } */

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
