$(function () {
$(document).scroll(function () {
  var $nav = $(".fixed-top");
  $nav.toggleClass('scrolled', $(this).scrollTop() >= window.innerHeight-460  );
  var $nav_link = $(".link-navbar");
  $nav_link.toggleClass('color-bl', $(this).scrollTop() >= window.innerHeight-460 );

});
});
