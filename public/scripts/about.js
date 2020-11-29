$(document).ready(function() {
  const button = $(".nav-button");
  const up = button.find("div").find(".up");
  const down = button.find("div").find(".down");
  const login = $(".login");

  login.hide();
  up.hide();

  button.click(function() {
    if (login.is(":hidden")) {
      down.hide();
      up.show();
      login.slideDown(function() {
      });
      button.blur();
    } else {
      up.hide();
      down.show();
      login.slideUp();
      button.blur();
    }
  });

});

<script type="text/javascript" src="/scripts/about.js"></script>
