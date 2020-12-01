$(document).ready(function() {

  $('.nav-button').on('click', () => {
    const x = document.getElementById("login");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    window.location = '#login';
  });
});
