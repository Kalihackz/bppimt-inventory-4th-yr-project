$(document).ready(function() {
    $("#form").submit(function(event)
    {
      event.preventDefault();

      if($("#pass").val() != $("#repass").val()){
        alert("Please make sure your passwords match");
      }
      else{
        var formData = {
        fname : $("#fname").val(),
        lname :  $("#lname").val(),
        password : $("#pass").val(),
        email_id : $("#email").val(),
        lab_no : $("#lab_no").val(),
        employee_id : $("#employee_id").val()
      }
      $.ajax({
              url: '/register',
              type: 'POST',
              enctype: 'multipart/form-data',
              data: JSON.stringify(formData),
              contentType: false,
              dataType : 'text',
              cache: false,
              processData:false,
              success: function(response) 
              {
              	alert(response)
                if(response == 'You are registered now')
                {
                  window.location.href="/login";
                }
              }                    
            });
      }
    });
});

