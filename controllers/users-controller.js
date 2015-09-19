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
                    var userData = {
                        username: $('#tb-login-username').val(),
                        password: $('#tb-login-password').val()
                    };
                    data.users.login(userData)
                        .then(function(resUsers) {
                            toastr.success('User seccessfully logged in!');
                        })
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
                        data.users.register(userData)
                            .then(function() {
                                toastr.success('User registered!');
                                context.redirect('#/');
                                // document.location.reload(true);
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

