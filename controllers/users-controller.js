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
                    data.users.login()
                        .then(function(resUsers) {
                            users = resUsers;
                        })
                })
            })

        var users;
    }

    function register(context) {
        templates.get('register')
            .then(function(template) {
                context.$element().html(template());

                $('#btn-already-registered').on('click', function(){
                    context.redirect('#/users/login');
                });

                $('#btn-register').on('click', function() {
                    var user = {
                        username: $('#tb-register-username').val(),
                        password: $('#tb-register-passwordInitial').val()
                    };

                    if (user.password ===  $('#tb-register-passwordConfirmed').val()){
                        data.users.register(user)
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

