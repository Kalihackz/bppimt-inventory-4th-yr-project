
  $(document).ready(function() {
    $("#reset-pass").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        email_id : $("#email-reset").val(),
      }
      if($("#email-reset").val()=='')
      {
        alert('Please fill the email field');
        return;
      }
      $.ajax({
              url: '/resetpass',
              type: 'POST',
              enctype: 'multipart/form-data',
              data: JSON.stringify(formData),
              contentType: false,
              dataType : 'text',
              cache: false,
              processData:false,
              success: function(response) 
              {
                if(response == 'Email not registered' || response == 'Empty email field')
                {
                  alert(response);
                }
                else{
                  $('#reset-pass').replaceWith(response);
                }
              }                    
            }); 
    });

    $(document).on('submit','#codeform',function(event)
    {
      event.preventDefault();
      var formData = {
        code : $("#code").val(),
      }
      if($("#code").val()=='')
      {
        alert('Please fill the code field');
        return;
      }
      $.ajax({
              url: '/verifycode',
              type: 'POST',
              enctype: 'multipart/form-data',
              data: JSON.stringify(formData),
              contentType: false,
              dataType : 'text',
              cache: false,
              processData:false,
              success: function(response) 
              {
                alert(response);
                if(response == 'Password resetted')
                {
                  window.location.href="/login";
                }
              }                    
            }); 
    });
});


