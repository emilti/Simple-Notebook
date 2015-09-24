var notebookController = function() {
    function getNotes(context) {
        var notesFromServer, count = 0;
        templates.get('notebook')
            .then(function (template) {
                context.$element().html(template());
                var loggedInUser = Parse.User.current();
                var collection = loggedInUser.get('dataStored');
                count = collection.length;
                var notesFromServer = [];
                for (var i = 0; i < collection.length; i++) {
                data.notes.getNotes(collection[i], notesFromServer)
                    .then(function(Note){
                        var obj = {
                            title: Note.get('title'),
                            content: Note.get('content'),
                            position: Note.get('position')
                        };
                        notesFromServer.push(obj);
                        }, function(){
                    }).then(function(){
                        if (notesFromServer.length === collection.length){
                            var sortedNotesFromServer = _.sortBy(notesFromServer, 'position');
                            for (var j = 0; j < sortedNotesFromServer.length; j+=1) {
                                $('<div />').append('<div class="panel-heading"/>')
                                    .append('<div class="panel-body"/>')
                                    .appendTo($('.notes-container'))
                                    .addClass('note')
                                    .addClass('current')
                                    .addClass('panel')
                                    .addClass('panel-primary');
                                $('.current .panel-heading').append('<h3 class="panel-title"/>')
                                console.log(sortedNotesFromServer[j]);
                                $('.current .panel-title').html(sortedNotesFromServer[j].title);
                                $('.current .panel-body').html(sortedNotesFromServer[j].content);
                                $('.notes-container').children().removeClass('current');
                            }
                        }
                    })
                }

                $('.btn-add-note').on('click', function () {
                     $('<div />').append('<input type="text" value="" placeholder="Enter title" class="note-title form-control" />')
                         .append('<textarea class="note-content form-control" rows="4" placeholder="Enter your note.." style="resize:none">')
                         .appendTo($('.notes-container'))
                         .addClass('note')
                         .addClass('current')
                         .addClass('panel')
                         .addClass('panel-primary');
                    // $('.current .panel-heading').append('<input type="text" value="" placeholder="title" class="note-title form-control" />')
                    // $('.current .panel-body').append('<textarea class="note-content form-control" rows="3" placeholder="Enter your note.." style="resize:none">')
                     $('.btn-add-note').prop("disabled", true);
                    $('.btn-save-note').prop("disabled", false);
                    $('.btn-edit-note').prop("disabled", true);
                });

                $('.btn-save-note').on('click', function () {
                    count++;
                     var noteData = {
                        title: ($('.current .note-title').val()),
                        content: ($('.current .note-content').val()),
                       position: count
                     }

                    data.notes.addNote(noteData)
                        .then(function(note){
                            var noteTitle =  $('.current .note-title').val();
                            var noteContent = $('.current .note-content').val();
                            $('.btn-save-note').prop("disabled", true);
                            $('.btn-edit-note').prop("disabled", false);
                            $('.btn-add-note').prop("disabled", false);
                            $('.current .note-title').remove();
                            $('.current .note-content').remove();

                            // $('.current .note-title').prop("disabled", true);
                            // $('.current .note-title').css("border", "0");
                            // $('.current .note-content').prop("disabled", true);
                            // $('.current .note-content').css("border", "0");
                            $('.current').append('<div class="panel-heading"/>')
                                .append('<div class="panel-body"/>')
                                .appendTo($('.notes-container'))
                                .addClass('note')
                                .addClass('panel')
                                .addClass('panel-primary');
                            $('.current .panel-heading').append('<h3 class="panel-title"/>');
                            $('.current .panel-title').html(noteTitle);
                            $('.current .panel-body').html(noteContent);
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
         })
     }
    return {
        getNotes: getNotes
    };
}();


