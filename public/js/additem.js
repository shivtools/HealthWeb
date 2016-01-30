$(document).ready(function(){
	$.ajax({
						type: 'POST',
						data: "You are not allowed to access this page",
				        contentType: 'application/json',
                        url: 'http://localhost:3000/newitem',						
                        success: function(data) {
                            console.log('Cannot access');
                        }
                    });
});