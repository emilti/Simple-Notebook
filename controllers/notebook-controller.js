var notebookController = function() {

    function getNotes(context){
        var loggedInUser = Parse.User.current();
        var collection = loggedInUser.get('dataStored');
        var notesFromServer
        for (var i = 1; i <= collection.length; i++) {
            var Note = Parse.Object.extend("Note");
            var query = new Parse.Query(Note);
            query.get(collection[i - 1].id, {
                success: function (note) {
                    notesFromServer;
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        }




        templates.get('notebook')
            .then(function(template) {
                context.$element().html(template(notesFromServer));

                $('.btn-add-note').on('click', function() {
                    $('<div />').append('<input type="text" value="" placeholder="title" class="note-title"/>').
                        append('<textarea class="note-content" placeholder="Enter your note.." style="resize:none">').
                        appendTo($('.notes-container')).addClass('note').addClass('current');
                    $('.btn-add-note').prop( "disabled", true );
                    $('.btn-save-note').prop( "disabled", false );
                    $('.btn-edit-note').prop( "disabled", true );

                    $('.btn-save-note').on( 'click', function(){
                        var noteData = {
                            title: ($('.current .note-title').val()),
                            content: ($('.current .note-content').val())
                        }

                        data.notes.addNote(noteData);
                    });

                });

                $('#btn-logout').on('click', function() {
                        Parse.User.logOut();
                        localStorage.clear();
                        context.redirect('#/');
                    }
                );
            });
    }

    return {
        getNotes: getNotes
    };
}();


