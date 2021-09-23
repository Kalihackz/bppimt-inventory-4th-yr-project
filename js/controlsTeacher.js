$("#request_product").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        fname : $("#employeefname").val(),
        lname : $("#employeelname").val(),
        employee_id : $("#employeeid").val(),
        email_id :  $("#emailid").val(),
        status : $("#status").val(),
        product_category : $("#product_category").val(),
        product_type : $("#product_type").val(),
        quantity_required :  $("#quantity_required").val(),
        installation_place :  $("#installation_place").val()
      }
      $.ajax({
              url: '/teacher/askreq',
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
                document.getElementById("request_product").reset()
              }                    
            }); 
    });

$('#search').on('input', function () {
    event.preventDefault();
    search = $("#search").val();
    modevalue = $("#modeVal").val();
    if(search == '')
    {
        $.ajax({
            url: `/teacher/requests?empid=${empid}&email=${email}`,
            type: 'GET',
            contentType: false,
            dataType: 'html',
            cache: false,
            processData: false,
            success: function (response) {
                if ((response) == "denied") {
                    window.location.replace('/login')
                }
                else
                    dataList(JSON.parse(response))
            }
        });
    }
    else
    {
        $.ajax({
            url: `/teacher2/requests2/status?empid=${empid}&email=${email}&status=${search}`,
            type: 'GET',
            contentType: false,
            dataType: 'html',
            cache: false,
            processData: false,
            success: function (response) {
                if ((response) == "denied") {
                    window.location.replace('login')
                }
                else
                    dataList(JSON.parse(response))
            }
        });
    }
});
