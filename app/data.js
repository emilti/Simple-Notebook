var data = (function(){
    var STORAGE_AUTH_KEY = 'SPECIAL_AUTHENTICATION_KEY'
    /*User*/
    function register(userData){
        event.preventDefault();
        var loggedInUser = Parse.User.current();
        Parse.User.logOut();
        var user = new Parse.User();
        // updateMainDate(today);
        user.set("username", userData.username);
        user.set("password", userData.password);
        user.set("dataStored", []);
        //user.set("email", $signUpFieldEmail.val());
        var promise = new Promise(function(resolve, reject){
            user.signUp(null, {
                success: function (user) {
                    localStorage.setItem('username', userData.username);
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

    function login(userData){
        var promise = new Promise(function(resolve, reject){
            Parse.User.logIn(userData.username, userData.password, {
              success: function (user) {
                        localStorage.setItem('username', userData.username);
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

