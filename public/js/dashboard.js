$(document).ready(function () {

    loadItems(function (items) {
        var img = window.btoa(items[0].image)
        console.log(img)
        //reader.readAsArrayBuffer(items[0].description.data)
        items.forEach(element => {
            $('.list-group').append('<li class="list-group-item"><div>' +
                '<div class="col"><div class="row"><div class="col"><h4>' +
                element.name + '</h4><p>' + String.fromCharCode.apply(null, element.description.data) + '<br><br>Weight: ' + element.weight +
                '</p></div><div class="col"><img src="data:image/jpg;base64,"' + window.btoa(element.image) + '>' +
                '</div></div></div></div><div class="row"><div class="col d-flex justify-content-center">' +
                '<button class="btn btn-primary d-lg-flex justify-content-center"type="button" style="background-color: rgb(33,74,128);width: 200px;margin-right: 10px;">Add to basket</button>' +
                '<input type="number" name="quantity" value="1" placeholder="1" min="1"max="99" step="1" style="margin-left: 10px;width: 50px;"></div></div></li>')
        });
    });

    $("#signout").click(function () {
        event.preventDefault();

        $.ajax({
            type: "POST",
            url: "signout",
        }).done(function (response) {
            if (response.url !== "") {
                window.location.href = response.url
            }
        });
    })

    function loadItems(callback) {
        $.ajax({
            type: "GET",
            url: "get-items",
        }).done(function (response) {
            callback(response)
        });


    }
})