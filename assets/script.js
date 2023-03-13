

// API info
// Name:
// Default
// Key:
// 3fade8c75faf1243c424955cb9eafdfa


var formEl = $('#currentCity');
var nameInputEl = $('#name-input');
var commentInputEl = $('#comment-input');

var locationDisplayEl = $('#locationDisplay');

var printQueryData = function (name, comment) {
  var cardColumnEl = $('<div>');
  cardColumnEl.addClass('col-12 col-sm-4 col-md-3');

  var cardEl = $('<div>');
  // Add a class of .custom-card
  cardEl.addClass('card h-100 custom-card');
  cardEl.appendTo(cardColumnEl);

  // Add a class of .custom-card-header
  var cardName = $('<h5>').addClass('card-header custom-card-header').text(name);
  cardName.appendTo(cardEl);

  var cardBodyEl = $('<div>');
  cardBodyEl.addClass('card-body');
  cardBodyEl.appendTo(cardEl);

  var cardComment = $('<p>').addClass('card-text').text(comment);
  cardComment.appendTo(cardBodyEl);

  locationDisplayEl.append(cardColumnEl);
};

var handleFormSubmit = function (event) {
  event.preventDefault();

  var nameInput = nameInputEl.val();
  var commentInput = commentInputEl.val();

  if (!nameInput || !commentInput) {
    console.log('Where are you plannning going to?');
    return;
  }

  printQueryData(nameInput, commentInput);

  // reset form
  nameInputEl.val('');
  commentInputEl.val('');
};

formEl.on('submit', handleFormSubmit);






// 

// 3. What is the current time in the format: hours:minutes:seconds
var time = dayjs().format('hh:mm:ss');
$('#3a').text(time);