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
                    resolve(user);
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
            console.log(userData.username);
            console.log( userData.password);
            Parse.User.logIn(userData.username, userData.password, {
              success: function (user) {
                        localStorage.setItem('username', userData.username);
                        resolve(user);
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
        var note = new Note();

        note.save({
            title: noteData.title,
            content:noteData.content,
            user: Parse.User.current()
        }, {
            success: function(gameScore) {
                $('.btn-save-note').prop( "disabled", true );
                $('.btn-edit-note').prop( "disabled", false );
                $('.btn-add-note').prop( "disabled", false )
                $('.current .note-title').prop("disabled", true);
                $('.current .note-title').css("border", "0");
                $('.current .note-content').prop("disabled", true);
                $('.current .note-content').css("border", "0");
                $('.notes-container').children().removeClass('current');
            },
            error: function(gameScore, error) {
                // The save failed.
                // error is a Parse.Error with an error code and message.
            }
        });
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

