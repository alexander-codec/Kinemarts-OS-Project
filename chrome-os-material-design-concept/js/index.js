var userInfo = $('.user-info');
var fs = $('.fullscreen-button');
var html = document.documentElement;

function fullscreenExit() {
  if (html.exitFullscreen) {
    html.exitFullscreen();
  } else if (html.msExitFullscreen) {
    html.msExitFullscreen();
  } else if (html.mozExitFullScreen) {
    html.mozExitFullScreen();
  } else if (html.webkitExitFullscreen) {
    html.webkitExitFullscreen();
    $('.fullscreen-icon').html('fullscreen');
  }
}
function fullscreen() {
  if (html.requestFullscreen) {
    html.requestFullscreen();
  } else if (html.msRequestFullscreen) {
    html.msRequestFullscreen();
  } else if (html.mozRequestFullScreen) {
    html.mozRequestFullScreen();
  } else if (html.webkitRequestFullscreen) {
    html.webkitRequestFullscreen();
  }
  $('.fullscreen-icon').html('fullscreen_exit');
  
}

fs.on('click', function() {
  if(document.fullscreenElement ||
     document.mozFullScreenElement ||
     document.webkitFullscreenElement ||
     document.msFullscreenElement) {
    fullscreenExit();
  } else {
    fullscreen();
  }
});

$('.tray-button').click(function() {
  $('.tray-menu').toggleClass('open');
  $(this).toggleClass('tray-button--active');
});