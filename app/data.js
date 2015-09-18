var data = (function(){
    var STORAGE_AUTH_KEY = 'SPECIAL_AUTHENTICATION_KEY'
    /*User*/
    function register(user){
        event.preventDefault();
        var loggedInUser = Parse.User.current();
        Parse.User.logOut();
        var user = new Parse.User();
        var init = $signUpFieldPasswordInitial.val();
        var confirmed = $signUpFieldPasswordConfirmed.val();
        // updateMainDate(today);
        if (init == confirmed) {
            user.set("username", $signUpFieldUsername.val());
            user.set("password", $signUpFieldPasswordInitial.val());
            user.set("dataStored", []);
            //user.set("email", $signUpFieldEmail.val());
            var promise = new Promise(function(resolve, reject){
            user.signUp(null, {
                success: function (user) {
                    saveCurrentUserSession($signUpFieldUsername.val());
                    $invalidPassword.detach();
                    // displayData();
                    resolve();
                },
                error: function (user, error) {
                    alert("Error: " + error.code + " " + error.message);
                    reject();
                }
            });
        });
        return promise;
        }
    }

    function login(user){
        var promise = new Promise(function(resolve, reject){
            Parse.User.logIn($signInFieldUsername.val(), $signInFieldPassword.val(), {
              success: function (user) {
                        saveCurrentUserSession($signInFieldUsername.val());
                        localStorage.setItem('dataStored', JSON.stringify(user.get('dataStored')));
                        resolve();
                    },
                    error: function (user, error) {
                        alert("Error: " + error.code + " " + error.message);
                        reject();
                    }
                });
            })

        return promise;
    }


    return {
        users:{
            register: register,
            login: login
        }
    }
}())

