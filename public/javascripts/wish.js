const $clickedElement = $(this); // store reference to clicked element

$.ajax({
  // ...
  success: function(response) {
    // ...
    $clickedElement.text('Added to Wishlist').prop('disabled', true);
    // ...
  },
  // ...
});
$.ajax({
  url: '/wishlist/add',
  method: 'POST',
  contentType: 'application/json', // add this line
  data: JSON.stringify({ productId: productId }), // convert object to JSON
  // ...
});
$.get('/wishlist', function(data) {
  // ...
}).fail(function() {
  alert('Error fetching updated wishlist.');
});
const templateHtml = $('#wishlist-template').html();

if (templateHtml !== undefined) {
    const template = Handlebars.compile(templateHtml);
    $('#wishlist').html(template({ wishlist: data }));
}

$(document).ready(function(){

  $('.toggle-btn').click(function() {
  $(this).toggleClass('active').siblings().removeClass('active');
  });
  
  });