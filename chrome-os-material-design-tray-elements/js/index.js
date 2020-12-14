// Code for date
var el = document.querySelector('#date');
var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();
var str = days[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
el.textContent = str;

function expand() {
  document.querySelector("#js-volume-slider").classList.toggle("active");
}