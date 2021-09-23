$('#submitGrant').on('click', function () {
    event.preventDefault();
    val = document.getElementById('hiddenvalue2').value
    var formData = {
        _id: val
    }
    $.ajax({
        url: `/admin/reqgrant`,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: JSON.stringify(formData),
        contentType: false,
        dataType: 'text',
        cache: false,
        processData: false,
        success: function (response) {
            //alert(typeof(response))
            alert(response)
            location.reload();
        }
    });
});

$('#submitDeny').on('click', function () {
    event.preventDefault();
    val = document.getElementById('hiddenvalue2').value
    var formData = {
        _id: val
    }
    $.ajax({
        url: `/admin/reqdeny`,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: JSON.stringify(formData),
        contentType: false,
        dataType: 'text',
        cache: false,
        processData: false,
        success: function (response) {
            //alert(typeof(response))
            alert(response)
            location.reload();
        }
    });
});

$('#deleteProduct').on('click', function () {
    event.preventDefault();
    val = document.getElementById('hiddenvalue').value;
    pc = document.getElementById('hiddencategory').value;
    var formData = {
        _id: val,
        product_category: pc 
    }
    $.ajax({
        url: `/admin/deleteproduct`,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: JSON.stringify(formData),
        contentType: false,
        dataType: 'text',
        cache: false,
        processData: false,
        success: function (response) {
            //alert(typeof(response))
            alert(response)
            location.reload();
        }
    });
});

$('#deleteUser').on('click', function () {
    event.preventDefault();
    val = document.getElementById('hiddenvalue').value
    empid = document.getElementById('empid').value
    var formData = {
        _id: val,
        empid: empid
    }
    $.ajax({
        url: `/admin/deleteuser`,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: JSON.stringify(formData),
        contentType: false,
        dataType: 'text',
        cache: false,
        processData: false,
        success: function (response) {
            //alert(typeof(response))
            alert(response)
            location.reload();
        }
    });
});

$('#deleteRejected').on('click', function () {
    event.preventDefault();
    val = document.getElementById('hiddendelete').value
    var formData = {
        _id: val
    }
    $.ajax({
        url: `/admin/deleterejected`,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: JSON.stringify(formData),
        contentType: false,
        dataType: 'text',
        cache: false,
        processData: false,
        success: function (response) {
            //alert(typeof(response))
            alert(response)
            location.reload();
        }
    });
});

$("#update_user").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        _id : $("#uniquevalue").val(),
        employee_id : $("#employee_id").val(),
        fname : $("#fname").val(),
        lname :  $("#lname").val(),
        designation : $("#designation").val(),
        lab_no :  $("#lab_no").val(),
        email_id :  $("#email_id").val()
      }
      $.ajax({
              url: '/admin/updateusers',
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
                location.reload();
              }                    
            }); 
    });

$("#update_product").submit(function(event)
{
    event.preventDefault();
    var formData = {
    _id : $("#uniquevalue").val(),
    product_category : $("#product_categoryhidden").val(),
    employee_id : $("#employee_id2").val(),
    fname : $("#fname2").val(),
    lname :  $("#lname2").val(),
    installation_place : $("#installation_place2").val(),
    issue_date :  $("#issue_date2").val(),
    status :  $("#statusInvenVal").val(),
    }
    $.ajax({
            url: '/admin/updateproducts',
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
            location.reload();
            }                    
        }); 
});

$("#add_product").submit(function(event)
    {
      event.preventDefault();
      var formData = {
        product_id : $("#product_id2").val(),
        product_category : $("#product_category2").val(),
        product_type :  $("#product_type2").val(),
        brand : $("#brand2").val(),
        price :  $("#price2").val(),
        supplier :  $("#supplier2").val(),
        purchase_date :  $("#purchase_date2").val(),
        transaction_id :  $("#transaction_id2").val(),
      }
      $.ajax({
              url: '/admin/addproducts',
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
                location.reload();
              }                    
            }); 
    });

$("#allow_employee").submit(function(event)
{
    event.preventDefault();
    var formData = {
    employee_id : $("#employee_id2").val(),
    designation : $("#designation2").val(),
    }
    $.ajax({
            url: '/admin/allowemployee',
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
            location.reload();
            }                    
        }); 
});

$(window).on('load', function () {
    event.preventDefault();
    modevalue = $("#modeVal").val();
    $.ajax({
        url: `/admin/all?mode=${modevalue}`,
        type: 'GET',
        contentType: false,
        dataType: 'html',
        cache: false,
        processData: false,
        success: function (response) {
                dataList(JSON.parse(response))
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
            url: `/admin/all?mode=${modevalue}`,
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
            url: `/admin/dashboard?mode=${modevalue}&val=${search}`,
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
});