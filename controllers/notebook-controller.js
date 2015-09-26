var notebookController = function() {
    function getNotes(context) {
        var notesFromServer, count = 0;
        templates.get('notebook')
            .then(function (template) {
                context.$element().html(template());
                var loggedInUser = Parse.User.current();
                var notesFromServer = [];

                if (localStorage.getItem('dataStored') !== null){
                    var collection = JSON.parse(localStorage.getItem('dataStored'));
                } else {
                    collection = loggedInUser.get('dataStored');
                }

                count = collection.length;
                localStorage.setItem('dataStored', JSON.stringify(collection));
                for (var i = 0; i < collection.length; i++) {
                data.notes.getNotes(collection[i])
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
                                $('.current').append('<div class="operation-buttons row"/>')
                                appendingButtons();
                                $('.notes-container').children().removeClass('current');
                            }
                        }

                        $('.btn-edit-note').on('click', function () {
                            var $this = $(this);
                            $this.parent().parent().parent().addClass('current');
                            $('.btn-edit-note').prop("disabled", true);
                            $('.current .btn-save-note').prop("disabled", false);

                            // Getting the current data from the edited note
                            var currentTitle = $('.current .panel-title').html();
                            var currentContent = $('.current .panel-body').html();

                            // removing the note elements and adding the elements for editing - input field and textarea
                            $('.current .panel-heading').remove();
                            $('.current .panel-body').remove();
                            $('.current').prepend('<div class="adding-body"/>')
                            $('.current .adding-body').append('<textarea style="resize:none" rows="4"/>');
                            $('.current .adding-body textarea').addClass('note-content form-control').val(currentContent);
                            $('.current').prepend('<div class="adding-heading"/>');
                            $('.current .adding-heading').append('<input type="text" />');
                            $('.current .adding-heading input').addClass('note-title form-control').val(currentTitle);
                            saveNote();
                        });
                    })
                }

                $('.btn-add-note').on('click', function () {
                     $('<div />').append('<div class="adding-heading"><input type="text" value="" placeholder="Enter title" class="note-title form-control" /></div>')
                         .append('<div class="adding-body"><textarea class="note-content form-control" rows="4" placeholder="Enter your note.." style="resize:none"></textarea></div>')
                         .appendTo($('.notes-container'))
                         .addClass('note')
                         .addClass('current')
                         .addClass('panel')
                         .addClass('panel-primary');
                    $('.current').append('<div class="operation-buttons row"/>')
                    appendingButtons();
                    saveNote()
                    $('.btn-add-note').prop("disabled", true);
                    $('.current .btn-save-note').prop("disabled", false);
                    $('.current .btn-edit-note').prop("disabled", true);
                });

                function saveNote() {
                    $('.btn-save-note').on('click', function () {
                        count++;
                        var noteData = {
                            title: ($('.current .note-title').val()),
                            content: ($('.current .note-content').val()),
                            position: count
                        }

                        data.notes.saveNote(noteData)
                            .then(function (note) {
                                var noteTitle = $('.current .note-title').val();
                                var noteContent = $('.current .note-content').val();
                                $('.current .btn-save-note').prop("disabled", true);
                                $('.current .btn-edit-note').prop("disabled", false);
                                $('.btn-add-note').prop("disabled", false);
                                $('.current .adding-heading').remove();
                                $('.current .adding-body').remove();
                                 $('.current')
                                     .prepend('<div class="panel-body"/>')
                                    .prepend('<div class="panel-heading"/>')
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
                                Parse.User.current().fetch();
                                var collectionFromStorage = localStorage.getItem('dataStored');
                                collectionFromStorage = (collectionFromStorage === null) ? [] : JSON.parse(collectionFromStorage);
                                collectionFromStorage.push(note.id);
                                localStorage.setItem('dataStored', JSON.stringify(collectionFromStorage));
                            }, function () {
                                toastr.error("Unsuccessful adding of a note!")
                            })
                    });
                }

                $('#btn-logout').on('click', function () {
                     Parse.User.logOut();
                     localStorage.clear();
                     context.redirect('#/');
                });
         })

        function appendingButtons() {
            $('.current .operation-buttons').append('<div class="col-md-offset-5 col-md-2"><button class="btn btn-md btn-success form-control btn-save-note" disabled>Save</div>')
                .append('<div class="col-md-2"><button class="btn btn-md btn-primary form-control btn-edit-note">Edit</button></div>')
                .append('<div class="col-md-2"><button class="btn btn-md btn-danger form-control btn-delete-note">Delete</button></div>')
        }
     }
    return {
        getNotes: getNotes
    };
}();


