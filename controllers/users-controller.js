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

                    Parse.User.logIn(userData.username, userData.password, {
                        success: function (user) {
                            localStorage.setItem('username', userData.username);
                            toastr.success('User successfully logged in!');
                            context.redirect('#/notebook');
                            document.location.reload(true);
                        },
                        error: function (user, error) {
                        }
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
                        var user = new Parse.User();
                        // updateMainDate(today);
                        user.set("username", userData.username);
                        user.set("password", userData.password);
                        user.set("dataStored", []);
                        user.signUp(null, {
                               success: function (user) {
                                    localStorage.setItem('username', userData.username);
                                    toastr.success('User registered!');
                                    context.redirect('#/notebook');
                                    document.location.reload(true);
                                },
                                error: function (user, error) {
                                    toastr.error("Unable to register!")
                                }
                            });



                    } else {
                        toastr.error("Invalid password confirmation!")
                        context.redirect('#/users/register');
                    }
                });

            });
    }


    return {
        login: login,
        register: register
    };
}();

