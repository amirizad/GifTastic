var animal = [],
		car = [],
		person = [],
		category = "",
		url = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=";

$(window).on('load', function() {
	if (localStorage.getItem('animal') === null) {
		giphyFuncs.downloadData()
	} else {
  	animal = JSON.parse(localStorage.getItem('animal'));
  	car = JSON.parse(localStorage.getItem('car'));
  	person = JSON.parse(localStorage.getItem('person'));
	}

	
	$('#category').change(function() {
		category = $('#category option:selected').val();
		$('#newitem').attr('placeholder', category + ' Name');
		$('#gifpanel').html('');
		$('#buttons').html('');
		for( j = 0 ; j < window[category].length ; j++){
			giphyFuncs.addBtn(window[category][j]);
		};
		$('#buttonsrow').removeClass('hide');
		$('#resultrow').addClass('hide');
		$('#addbtn').removeAttr('disabled');
  });

	$('#endpoint').change(function() {
		var endPoint = $('#endpoint option:selected').val();
		$('#gifpanel').html('');
		$('#resultrow').addClass('hide');
		url = 'https://api.giphy.com/v1/' + endPoint + '/search?api_key=dc6zaTOxFJmzC&limit=10&q=';
  });

  $('#addbtn').click(function(event) {
  	var newItem = $('#newitem').val().trim().toLowerCase();
  	newItem = newItem.length > 0 ? newItem : null;
  	var newValue = $.inArray(newItem, window[category]);
  	if(newItem && newValue === -1){
  		giphyFuncs.addBtn(newItem);
  		window[category].push(newItem);
  		giphyFuncs.getGiphy(newItem);
  	} else if (newItem && newValue >= 0){
  		$('.callgif').removeClass('showing');
  		$('.callgif:contains(' + newItem + ')').addClass('showing');
  		giphyFuncs.getGiphy(window[category][newValue]);
  	} else {
  		event.preventDefault();
  	};
  });
});

$(window).on('unload', function() {
  giphyFuncs.setData('animal');
  giphyFuncs.setData('car');
  giphyFuncs.setData('person');
});

var giphyFuncs = {
	downloadData: function(){
									$.getJSON( 'data/giphy.json', function() {
									  console.log( 'success' );
									})
								  .done(function(data) {
								  	animal = data.animal.sort();
								  	car = data.car.sort();
								  	person = data.person.sort();
									  giphyFuncs.setData('animal');
									  giphyFuncs.setData('car');
									  giphyFuncs.setData('person');   	
								  })
								  .fail(function(error) {
								    console.log(error);
								  }); 
								},
			getGiphy:  function(text){
									var thisUrl = url + text.replace(/ /g, '+');
									$.getJSON(thisUrl, function() {
									  console.log( 'success' );
									})
								  .done(function(gifData) {
								  	var data = gifData.data;
								  	$('#gifpanel').html('');
								  	$('#newitem').val('');
								  	for (var i = 0; i < data.length; i++) {
											var rating = data[i].rating;
											var animated = data[i].images.fixed_height.url;
											var still = data[i].images.fixed_height_still.url;
											giphyFuncs.addGif(rating, still, animated);
								  	};
								  	$('#resultrow').removeClass('hide');
								  })
								  .fail(function(error) {
								    console.log(error);
								  }); 
								},
			setData: 	function (myKey){
									localStorage.setItem(myKey, JSON.stringify(window[myKey].sort()));
								},
			 addBtn:  function(text){
									var btn = $('<button>').addClass('btn btn-primary callgif')
															.attr({'type':'button', 'title': text})
															.val(text).text(text)
															.click(giphyFuncs.btnHandler);
									$('#buttons').append(btn);
								},
	 btnHandler:  function (){
	 								$('.callgif').removeClass('showing');
	 								$(this).addClass('showing');
									giphyFuncs.getGiphy($(this).val());
								},
			 addGif:  function (rating, still, animated){
									var $div = $('<div>').addClass('gifbox pull-left');
									var $p = $('<p>').addClass('rating').text('Rating:');
									var $img = $('<img>').attr({'src': 'assets/images/'+ rating +'.jpg', 'alt': rating});
									var $download = $('<a>').attr({'href':animated, 'download':'GifTastic'});
									$download.append($('<span>').addClass('fa fa-download')
																							.attr('title','Download'));
									$p.append($img, $download);
									var $gifimg = $('<img>').addClass('gifimg img-thumbnail')
															.attr({'src':still, 'data-state':'still', 'data-animate':animated, 'data-still':still})
															.click(giphyFuncs.gifHandler);
									$div.append($p, $gifimg);
									$('#gifpanel').append($div);
								},
	 gifHandler:  function(){
								  var state = $(this).attr('data-state');
								  if(state === 'still'){
								    $(this).attr('src', $(this).attr('data-animate'));
								    $(this).attr('data-state', 'animate');
								  }else{
								    $(this).attr('src', $(this).attr('data-still'));
								    $(this).attr('data-state', 'still');
								  };
								}
};