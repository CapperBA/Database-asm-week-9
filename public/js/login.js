$(document).ready(function () {

    $('#help-text1').hide();
    $('#help-text2').hide();
    $('#help-text1').text('Wrong username or password')

    $("#login").click(function () {
        event.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();

        let user = {
            "username": username,
            "password": password
        };

        $.ajax({
            type: "POST",
            url: "login-user",
            data: user
        }).done(function (response) {
            if (response.response !== "OK") { // if wrong username or password
                $('#help-text1').show();
                $('#username').focus().val();
            } else {
                window.location.href = response.url
            }
        });
    })


    $("#signup").click(function () {
        event.preventDefault();
        let username = $("#newusername").val();
        let address = $("#newaddress").val();
        let password = $("#newpassword").val();
        let passwordrepeat = $("#newpasswordrepeat").val();

        let newuser = {
            username: username,
            password: password,
            address: address
        }

        checkUsername(newuser.username, function (isUsernameAvailable) {
            //console.log("Username available:", isUsernameAvailable)
            if (isUsernameAvailable && checkPasswords(password, passwordrepeat)) {
                $.ajax({
                    type: "POST",
                    url: "signup-user",
                    data: newuser
                }).done(function (response) {
                    console.log(response.response)
                    if (response) {
                        window.location.href = response.url
                        alert("User created")
                    }
                });
            }
        });
    })

    function checkPasswords(password, rpassword) {
        if (password === rpassword) {
            //$('#help-text2').hide()
            return true
        } else {
            $('#help-text2').show()
            $('#help-text2').text('Passwords need to be the same')
            $('#newpassword').focus().val();
            return false;
        }
    }

    function checkUsername(name, callback) {
        $.ajax({
            type: "GET",
            url: "/check-username/" + name,
        }).done(function (response) {
            if (response.response === "OK") {
                //$('#help-text2').hide()
                callback(true);
            } else {
                $('#help-text2').show()
                $('#help-text2').text('Username already taken')
                $('#newusername').focus().val();
                callback(false);
            }
        });
    }

    $("#newaddress").keyup(delayEvent(function (e) {
        // this refers to the element clicked, and there is an issue with in the if statement
        // you are checking postcode.length.length which probably throws an error.
        var address = $(this).val();
        let autocomplete = []

        $.ajax({
            type: "GET",
            url: "https://dawa.aws.dk/adresser?q=" + address,
        }).done(function (response) {
            response.forEach(element => {
                autocomplete.push(element.adressebetegnelse)
            });

            $("#newaddress").autocomplete({
                source: function (request, response) {
                    var results = $.ui.autocomplete.filter(autocomplete, request.term);
                    response(results.slice(0, 10));
                }
            });
        });

    }, 250));

    // this is a functional decorator, that curries the delay and callback function
    // returning the actual event function that is run by the keyup handler
    function delayEvent(fn, delay) {
        var timer = null;
        // this is the actual function that gets run.
        return function (e) {
            var self = this;
            // if the timeout exists clear it
            timer && clearTimeout(timer);
            // set a new timout
            timer = setTimeout(function () {
                return fn.call(self, e);
            }, delay || 200);
        }
    }

})