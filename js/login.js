$(document).ready(function() {
    $("#form").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        employee_id : $("#employee_id").val(),
        password :  $("#password").val()
      }
      $.ajax({
              url: '/login',
              type: 'POST',
              enctype: 'multipart/form-data',
              data: JSON.stringify(formData),
              contentType: false,
              dataType : 'text',
              cache: false,
              processData:false,
              success: function(response) 
              {
              	if(response=="/admin" || response=="/teacher"){window.location.pathname = response}
              	else{document.getElementById('wrong-user-pass').innerHTML = response;}
              }                    
            }); 
    });
});

