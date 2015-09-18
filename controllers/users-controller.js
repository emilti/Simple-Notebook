var usersController = function() {

    function login(context) {
        // event.preventDefault();
        templates.get('login')
            .then(function(template){
                context.$element().html(template());
            })

        var users;
        $('#go-to-sign-up-button').on('click', function(){
            this.redirect('#/users/register');
        })


        //$('#form-sign-in-button').on('click', function(){
        //    data.users.login()
        //        .then(function(resUsers) {
        //            users = resUsers;
        //        })
        //})

    }

    function register(context) {
        templates.get('register')
            .then(function(template) {
                context.$element().html(template());

                $('#btn-register').on('click', function() {
                    var user = {
                        username: $('#tb-reg-username').val(),
                        password: $('#tb-reg-pass').val()
                    };

                    data.users.register(user)
                        .then(function() {
                            context.redirect('#/');
                            document.location.reload(true);
                        });
                });
            });
    }

    return {
        login: login,
        register: register
    };
}();

