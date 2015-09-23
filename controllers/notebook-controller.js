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
            data.notes.getNotes(collection[i])
                .then(function(Note){
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
                }, function(){
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                })
        }

             $('.btn-add-note').on('click', function () {
                 $('<div />').append('<input type="text" value="" placeholder="title" class="note-title"/>').
                     append('<textarea class="note-content" placeholder="Enter your note.." style="resize:none">').
                     appendTo($('.notes-container')).addClass('note').addClass('current');
                 $('.btn-add-note').prop("disabled", true);
                 $('.btn-save-note').prop("disabled", false);
                 $('.btn-edit-note').prop("disabled", true);
             });

             $('.btn-save-note').on('click', function () {
                 var noteData = {
                     title: ($('.current .note-title').val()),
                     content: ($('.current .note-content').val())
                 }

                 console.log(noteData);

                 data.notes.addNote(noteData)
                     .then(function(note){
                         $('.btn-save-note').prop("disabled", true);
                         $('.btn-edit-note').prop("disabled", false);
                         $('.btn-add-note').prop("disabled", false)
                         $('.current .note-title').prop("disabled", true);
                         $('.current .note-title').css("border", "0");
                         $('.current .note-content').prop("disabled", true);
                         $('.current .note-content').css("border", "0");
                         $('.notes-container').children().removeClass('current');
                         toastr.success("Note saved!")
                         var user = Parse.User.current();
                         user.add("dataStored", note.id);
                         user.save();
                     }, function(){
                         toastr.error("Unsuccessful adding of a note!")
                     })
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


