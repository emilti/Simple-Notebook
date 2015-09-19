(function() {

    var sammyApp = Sammy('#content', function() {
        this.get('#/',function(){
            this.redirect('#/users/login');
        });

        this.get('#/users/login', usersController.login);
        this.get('#/users/register', usersController.register);

        this.get('#/notebook', notebookController.getNotes);
    });

    $(function() {
        sammyApp.run('#/');




    });
}());