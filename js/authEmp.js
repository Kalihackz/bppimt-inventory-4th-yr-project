$(document).ready(function() {
    $("#empform").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        employee_id : $("#employee_id").val(),
      }
      $.ajax({
              url: '/auth/employee',
              type: 'POST',
              enctype: 'multipart/form-data',
              data: JSON.stringify(formData),
              contentType: false,
              dataType : 'text',
              cache: false,
              processData:false,
              success: function(response) 
              {
              	if(response.startsWith('/register')){window.location.href = response}
              	else{alert(response);}
              }                    
            }); 
    });
});

