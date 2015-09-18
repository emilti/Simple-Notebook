(function() {

    var sammyApp = Sammy('#content', function() {
        var $content = $('#content');

        this.get('#/users/login', usersController.all);
        this.get('#/users/register', usersController.register);


    });

    $(function() {
        sammyApp.run('#/');

        if (data.users.hasUser()) {
            $('#container-sign-in').addClass('hidden');
            $('#btn-sign-out').on('click', function() {
                data.users.signOut()
                    .then(function() {
                        document.location = '#/';
                        document.location.reload(true);
                    });
            });
        } else {
            $('#container-sign-out').addClass('hidden');
            $('#btn-sign-in').on('click', function() {
                var user = {
                    username: $('#tb-username').val(),
                    password: $('#tb-password').val()
                };
                data.users.signIn(user)
                    .then(function(user) {
                        document.location = '#/';
                        document.location.reload(true);
                    }, function(err) {
                        console.log(err);
                    });
            });
        }
    });
}());