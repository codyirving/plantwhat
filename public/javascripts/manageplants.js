$(function(){
	$('.glyphicon.glyphicon-ban-circle.deletebutton').mouseover(function() {
		$(this).css('color', 'red');
	}).mouseout(function(event) {
		$(this).css('color', 'black');
	});
	$('.glyphicon.glyphicon-ban-circle.deletebutton').click(function() {
		//var id = $(this).text();
		var selected = $(this);
		var id = selected.siblings('.id').text();
		var requestURL = '/removeplant';
		var responseText;
		var jqxhr = $.ajax( {url: requestURL, datatype: "json", data: {id:id}} )
      		.done(function(responseText) {
		       //alert( "success:" + jqxhr.responseText + " ON: " );
		       	responseText = jQuery.parseJSON(jqxhr.responseText);
		        selected.parent().parent().parent().fadeOut('slow', function() {
		        	
		        });
		        var recordCount = $('h3.records');
		        var number = recordCount.text();
		        number = number - jqxhr.responseText;
		        recordCount.html(number);
		      })
		      .fail(function(responseText) {
		       alert( "error: " + responseText);
		      })
		      .always(function() {
			});
	});
	$('.glyphicon.glyphicon-edit.editbutton').click(function() {
		var selected = $(this);
		var id = selected.siblings('.id').text();
		var requestURL = '/editplant';
		var responseText;
		var jqxhr = $.ajax( {url: requestURL, datatype: "json", data: {id:id}})
			.done(function(responseText) {
				responseText = jQuery.parseJSON(jqxhr.responseText);
				console.log("Edit response: " + responseText);
				console.log("responseText[\"Common Name\"]: " + JSON.stringify(responseText[0]['Common Name']));
				$('.newplantfield#dbID').val(responseText[0]['_id']);
				$('.newplantfield#commonName').val((responseText[0]['Common Name']));
				$('.newplantfield#frostDifferentialMIN').val((responseText[0]['Frost Differential MIN']));
				$('.newplantfield#frostDifferentialMAX').val((responseText[0]['Frost Differential MAX']));
				$('.newplantfield#indoorStartDaysMIN').val((responseText[0]['Indoor Start MIN']));
				$('.newplantfield#indoorStartDaysMAX').val((responseText[0]['Indoor Start MAX']));
				$('.newplantfield#description').val((responseText[0]['Description']));
				$('.newplantfield#imageURL').val((responseText[0]['Image Link']));
				$('.newplantfield#wikiLink').val((responseText[0]['Wikipedia Link']));
				$('.newplantfield#purchaseLink').val((responseText[0]['Purchase Link']));

			})
			.fail(function(responseText) {
				responseText = jQuery.parseJSON(jqxhr.responseText);
				alert( "error: " + responseText);
			})
			.always(function(responseText) {
		
			});
	});
});