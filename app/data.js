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

    function addNote(noteData){

        var Note = Parse.Object.extend("Note");
        var user = Parse.User.current();
        var storedNote = new Note({
            title: noteData.title,
            content: noteData.content,
            user: user
        });

        var promise = new Promise(function(resolve, reject){
        storedNote.save(null, {
            success: function(note) {
                // Execute any logic that should take place after the object is saved.
                user.addUnique("dataStored", note);
                user.save();
                resolve(note);
            },
            error: function(gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.

                reject()
            }
        });
        })


        return promise;
    }


    return {
        users:{
            register: register,
            login: login
        },
        notes:{
            addNote:addNote
        }
    }
}())

