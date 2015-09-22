var usersController = function() {

    function login(context) {
        // event.preventDefault();
        templates.get('login')
            .then(function(template){
                context.$element().html(template());
                $('#btn-go-to-register-button').on('click', function(){
                    context.redirect('#/users/register');
                })

                $('#btn-login').on('click', function(){
                    event.preventDefault();
                    var userData = {
                        username: $('#tb-login-username').val(),
                        password: $('#tb-login-password').val()
                    };
                    data.users.login(userData)
                        .then(function(user){
                            toastr.success(user.username + " logged in")
                            context.redirect('#/notebook');
                             document.location.reload(true);
                        }, function(){
                            toastr.error("Unable to login!")
                        });
                })
            })
    }

    function register(context) {
        templates.get('register')
            .then(function(template) {
                context.$element().html(template());

                $('#btn-already-registered').on('click', function(){
                    context.redirect('#/users/login');
                });

                $('#btn-register').on('click', function() {
                    var userData = {
                        username: $('#tb-register-username').val(),
                        password: $('#tb-register-passwordInitial').val()
                    };

                    if (userData.password ===  $('#tb-register-passwordConfirmed').val()){
                        event.preventDefault();
                        var loggedInUser = Parse.User.current();
                        Parse.User.logOut();
                        data.users.register(userData)
                            .then(function(){
                                toastr.success('User registered!');
                                context.redirect('#/notebook');
                                document.location.reload(true);
                            }, function(){
                                toastr.error("Unable to register!")
                            })
                        }



                    //    var user = new Parse.User();
                    //    // updateMainDate(today);
                    //    user.set("username", userData.username);
                    //    user.set("password", userData.password);
                    //    user.set("dataStored", []);
                    //    user.signUp(null, {
                    //           success: function (user) {
                    //                localStorage.setItem('username', userData.username);
                    //                toastr.success('User registered!');
                    //                context.redirect('#/notebook');
                    //                document.location.reload(true);
                    //            },
                    //            error: function (user, error) {
                    //                toastr.error("Unable to register!")
                    //            }
                    //        });
                    //
                    //
                    //
                    //} else {
                    //    toastr.error("Invalid password confirmation!")
                    //    context.redirect('#/users/register');
                    //}
                });

            });
    }


    return {
        login: login,
        register: register
    };
}();

