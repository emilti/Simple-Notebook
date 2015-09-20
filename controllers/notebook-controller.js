var notebookController = function() {
    function getNotes(context) {
        templates.get('notebook')
            .then(function (template) {
                console.log();
                context.$element().html(template());
        var loggedInUser = Parse.User.current();
        var collection = loggedInUser.get('dataStored');
        var notesFromServer = [];
        for (var i = 0; i < collection.length; i++) {
            var Note = Parse.Object.extend("Note");
            var query = new Parse.Query(Note);
            query.get(collection[i], {
                success: function (Note) {
                    var obj = {
                        title: Note.get('title'),
                        content: Note.get('content')
                    };

                    $('<div />').append('<input type="text" value="" class="note-title"/>').
                        append('<textarea class="note-content" style="resize:none">').
                        appendTo($('.notes-container')).addClass('note').addClass('current');
                    $('.current input').val(obj.title);
                    $('.current textarea').html(obj.content);
                    $('.current .note-title').prop("disabled", true);
                    $('.current .note-title').css("border", "0");
                    $('.current .note-content').prop("disabled", true);
                    $('.current .note-content').css("border", "0");
                    $('.notes-container').children().removeClass('current');
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        }




                    $('.btn-add-note').on('click', function () {
                        $('<div />').append('<input type="text" value="" placeholder="title" class="note-title"/>').
                            append('<textarea class="note-content" placeholder="Enter your note.." style="resize:none">').
                            appendTo($('.notes-container')).addClass('note').addClass('current');
                        $('.btn-add-note').prop("disabled", true);
                        $('.btn-save-note').prop("disabled", false);
                        $('.btn-edit-note').prop("disabled", true);

                        $('.btn-save-note').on('click', function () {
                            var noteData = {
                                title: ($('.current .note-title').val()),
                                content: ($('.current .note-content').val())
                            }

                            var user = Parse.User.current();
                            var Note = Parse.Object.extend("Note");
                            var storedNote = new Note({
                                title: noteData.title,
                                content: noteData.content,
                                user: user
                            });


                            // user.addUnique("dataStored", storedNote);
                            // user.save();
                            storedNote.save(null, {
                                success: function (note) {
                                    $('.btn-save-note').prop("disabled", true);
                                    $('.btn-edit-note').prop("disabled", false);
                                    $('.btn-add-note').prop("disabled", false)
                                    $('.current .note-title').prop("disabled", true);
                                    $('.current .note-title').css("border", "0");
                                    $('.current .note-content').prop("disabled", true);
                                    $('.current .note-content').css("border", "0");
                                    $('.notes-container').children().removeClass('current');
                                    console.log(note);
                                    user.add("dataStored", note.id);
                                    user.save();
                                },
                                error: function (note, error) {
                                    // The save failed.
                                    // error is a Parse.Error with an error code and message.
                                }
                            })


                        });


                    });

                    $('#btn-logout').on('click', function () {
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


