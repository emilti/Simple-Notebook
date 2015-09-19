(function() {

    var sammyApp = Sammy('#content', function() {
        this.get('#/',function(){
            this.redirect('#/users/login');
        });

        this.get('#/users/login', usersController.login);
        this.get('#/users/register', usersController.register);

        this.get('#/notebook', notebookController.notebook);
    });

    $(function() {
        sammyApp.run('#/');
        if (localStorage.getItem('username') != undefined){
            $('#btn-logout').on('click', function() {
                    data.users.logout()
                        .then(function() {
                            location = '#/';
                        });
                }
            );

        }

    });
}());