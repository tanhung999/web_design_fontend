
$(document).ready(function () {
    load_data();
    function load_data() {
        $.ajax({
            method: "GET",
            dataType: "json",
            url: "http://localhost:3000/products",
            success: function (data){
                var html = '';
                if(data.products.length > 0)
                {
                    data.products.forEach(item => {
                        html += `
                            <tr>
                            <td>`+item.name+`</td>
                            <td>`+item.price+`$</td>
                            <td>`+item.description+`</td>
                            <td>`+item.quantity+`</td>
                            <td style="width:120px;"><image src="`+item.productImage+`"></td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm edit" data-id="`+item._id+`">Edit</button>
                                <button type="button" class="btn btn-danger btn-sm delete" data-id="`+item._id+`">Delete</button>
                            </td>
                            </tr>
                        `;
                    });
                }
                $('#table_product tbody').html(html);
            }
        });
    };
    
    
    $(document).on('click', '#btnAddProduct',function(e) {
        e.preventDefault();
        $('#exampleModalLongTitle').text('Add Product');
        $('#modalProduct').modal('show');
        $("#btnUpdate").attr('disabled', 'disabled');
        
        
        $(document).on('click', '#btnAdd',function(e) {
            e.preventDefault();
            var productImage = document.getElementById("productImage").files[0];
            var formData = new FormData();
            formData.append("name",$("#nameProduct").val());
            formData.append("price",$("#priceProduct").val());
            formData.append("description",$("#descriptionProduct").val());
            formData.append("quantity",$("#quantityProduct").val());
            formData.append("productImage",productImage);
            var request =$.ajax ({
                url:"http://localhost:3000/products",
                type:'POST',
                contentType: false,
                processData: false,
                data:formData
            })
            request.done(function(response,textStatus,jqXHR){
                $("#modalProduct").modal("toggle");
                alert("Add Product Success");
                load_data();
            });
            request.fail(function(jqXHR,textStatus,errorThrown){
                console.log(textStatus);
                console.log(errorThrown);
            });
        });

    });
    function getProductOne(id){
        $.ajax({
            method: "GET",
            dataType: "json",
            url: "http://localhost:3000/products/"+id,
            success: function (data){
                $('#nameProduct').val(data.product.name);
                $('#priceProduct').val(data.product.price);
                $('#descriptionProduct').val(data.product.description);
                $('#quantityProduct').val(data.product.quantity);
            }
        });
    };
    $(document).on('click', '.edit',function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('#exampleModalLongTitle').text('Update Product');
        $('#modalProduct').modal('show');
        $("#btnAdd").attr('disabled', 'disabled');
        $('#productImage').attr('disabled', 'disabled');
        getProductOne(id);
        
        $(document).on('click','#btnUpdate', function(e){
            e.preventDefault();
            var request =$.ajax ({
                url:"http://localhost:3000/products/"+id,
                type:'PUT',
                dataType:'json',
                data:{
                    name:$("#nameProduct").val(),
                    price:$("#priceProduct").val(),
                    description:$("#descriptionProduct").val(),
                    quantity:$("#quantityProduct").val()
                }
            })
            request.done(function(response,textStatus,jqXHR){
                $("#modalProduct").modal("toggle");
                alert("Update Product Success");
                load_data();
            });
            request.fail(function(jqXHR,textStatus,errorThrown){
                console.log(textStatus);
                console.log(errorThrown);
            });
        });
    });

    $(document).on('click', '.delete', function(){

        var id = $(this).data('id');

        if(confirm("Are you sure you want to delete this data?"))
        {
            $.ajax({
                url:"http://localhost:3000/products/"+id,
                method:"DELETE",
                success:function()
                {
                    alert("Delete Product Successfully!");
                    load_data();
                }
            });
        }

    });
    
    
});



