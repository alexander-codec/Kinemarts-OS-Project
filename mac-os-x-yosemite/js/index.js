$( ".window" ).draggable({ cancel: ".inside,input,textarea" });



$("input.address").focus(function(){
  $(".fa-refresh").hide(500);
  this.select();
}).focusout(function(){
  $(".fa-refresh").show(500);
});