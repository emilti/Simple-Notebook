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
                    reject();
                }
            });
        });

        return promise;
    }

    function login(userData) {
        var promise = new Promise(function (resolve, reject) {
            Parse.User.logIn(userData.username, userData.password, {
                success: function (user) {
                    localStorage.setItem('username', userData.username);
                    // localStorage.setItem('dataStored', userData.dataStored);

                    resolve(user)
                },
                error: function (error) {
                    reject()
                }
            });
        })
        return promise;
    }

    function initialSaveNote(noteData){
        var promise = new Promise(function (resolve, reject) {
        var Note = Parse.Object.extend("Note");
        var note = new Note();
        note.save({
            title: noteData.title,
            content:noteData.content,
            position:noteData.position
        }, {
            success: function(note) {
                resolve(note);
            },
            error: function(note, error) {
                reject();
            }
        });
    });
        return promise;
    }

    function saveNoteAfterEdit(noteData){
        var promise = new Promise(function (resolve, reject) {
        var Note = Parse.Object.extend("Note");
        var query = new Parse.Query(Note);
        query.equalTo("objectId", noteData.id);
        query.first({
            success: function(object) {
                object.set("title", noteData.title);
                object.set("content", noteData.content);
                object.set("position", noteData.position);
                object.save();
                resolve();
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    })
        return promise;
    }

    function saveNotesPositions(noteData){
        var promise = new Promise(function (resolve, reject) {
            var Note = Parse.Object.extend("Note");
            var query = new Parse.Query(Note);
            query.equalTo("objectId", noteData.id);
            query.first({
                success: function(object) {
                    object.set("position", noteData.position);
                    object.save();
                    resolve();
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        })
        return promise;
    }



    function getNotes(id){
        var promise = new Promise(function (resolve, reject) {
            var Note = Parse.Object.extend("Note");
            var query = new Parse.Query(Note);
            query.get(id, {
                success: function (Note) {                    ;
                    resolve(Note)
                },
                error: function (object, error) {
                    reject();
                }
        })
    })
        return promise;
    }


    return {
        users:{
            register: register,
            login: login
        },
        notes:{
            initialSaveNote: initialSaveNote,
            saveNoteAfterEdit: saveNoteAfterEdit,
            getNotes: getNotes,
            saveNotesPositions:saveNotesPositions
        }
    }
}())

