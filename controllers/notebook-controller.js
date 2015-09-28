var notebookController = function() {
    function getNotes(context) {
        var notesFromServer, count = 0;
        context.$element().html('<div class="main-container"></div>');
        // Adding log-out button Dom Element
        $('.main-container').append('<div class="row logout-row">');
        $('.main-container div').append('<div class="col-lg-offset-11 col-lg-1">');
        $('.main-container div div').append('<button class="btn btn-sm btn-danger" id="btn-logout" type="submit">Log-out</button>');

        // Adding the Add Note button
        $('.main-container').append('<div class="button-container btn-group row">');
        $('.main-container .button-container').append('<div class="col-md-offset-3 col-md-3">');
        $('.main-container .button-container div').append('<button type="submit">Add Note</button>')
        $('.main-container .button-container div button').addClass('btn btn-md btn-primary btn-add-note')
        $('.main-container .button-container').append('<div class="username col-md-offset-3 col-md-3">');
        $('.main-container .button-container').append('<div>');
        $('.main-container .button-container div').last().addClass('col-md-3');
        $('.main-container').append('<div class="notes-container" >');

        var mainPromise = new Promise(function (mainResolve, reject) {
            var loggedInUser = Parse.User.current();
            var notesFromServer = [], sortedNotesFromServer;

            $('.username').html(localStorage.getItem('username'));
            if (localStorage.getItem('dataStored') !== null) {
                var collection = JSON.parse(localStorage.getItem('dataStored'));
            } else {
                collection = loggedInUser.get('dataStored');
            }


            count = collection.length;
            localStorage.setItem('dataStored', JSON.stringify(collection));
            var Note = Parse.Object.extend("Note");
            var query = new Parse.Query(Note);
            localStorage.setItem('notes', 0)
            if (window.Promise) {
                var promise = new Promise(function (resolve, reject) {
                    for (var i = 0; i < collection.length; i++) {
                        query.get(collection[i], {
                            success: function (Note) {
                                var obj = {
                                    title: Note.get('title'),
                                    content: Note.get('content'),
                                    position: Note.get('position'),
                                    id: Note.id
                                };

                                var notes = localStorage.getItem('notes')
                                notesFromServer.push(obj);

                                notes = JSON.parse(notes);
                                if (notes == collection.length - 1) {
                                    console.log(notesFromServer);
                                    resolve(notesFromServer);
                                }

                                notes = notes + 1

                                localStorage.setItem('notes', notes);
                            },
                            error: function (object, error) {

                            }
                        })
                    }
                })
                promise.then(function (notesFromServer) {
                    console.log(notesFromServer)
                    sortedNotesFromServer = _.sortBy(notesFromServer, 'position');
                    for (var j = 0; j < sortedNotesFromServer.length; j += 1) {
                        $('<div />').append('<div class="panel-heading"/>')
                            .append('<div class="panel-body"/>')
                            .appendTo($('.notes-container'))
                            .addClass('note')
                            .addClass('current')
                            .addClass('panel')
                            .addClass('panel-primary');
                        $('.current .panel-heading').append('<h3 class="panel-title"/>');
                        $('.current .panel-title').html(sortedNotesFromServer[j].title);
                        $('.current .panel-body').html(sortedNotesFromServer[j].content);
                        $('.current').append('<div class="operation-buttons row"/>')
                        appendingButtons();
                        $('.notes-container').children().removeClass('current');
                        mainResolve(sortedNotesFromServer);
                    }
                })
            }
        }).then(function(sortedNotesFromServer){
                editNote();
                $('.btn-save-note').on('click', function () {
                    var $allElementsBeforeCurrent = $('.current').prevAll();
                    var lengthPrev = $allElementsBeforeCurrent.length;
                    var noteData = {
                        title: ($('.current .note-title').val()),
                        content: ($('.current .note-content').val()),
                        position: lengthPrev + 1,
                        id: sortedNotesFromServer[lengthPrev].id
                    }
                    data.notes.saveNoteAfterEdit(noteData)
                        .then(function () {
                            updateDOMAfterSave()
                            toastr.success("Note edited");
                        });
                });

                $('.btn-delete-note').on('click', function () {
                    var $this = $(this);
                    var loggedInUser = Parse.User.current();
                    var idOfDeletedElement;
                    $this.parent().parent().parent().addClass('current');
                    var $allElementsBeforeCurrent = $('.current').prevAll();
                    var lengthPrev = $allElementsBeforeCurrent.length;
                    $('.current').remove();

                    var collectionFromStorage = localStorage.getItem('dataStored');
                    collectionFromStorage = (collectionFromStorage === null) ? [] : JSON.parse(collectionFromStorage);
                    collectionFromStorage.splice(lengthPrev, 1);
                    localStorage.setItem('dataStored', JSON.stringify(collectionFromStorage));
                    console.log(loggedInUser);
                    var dataStored = loggedInUser.get('dataStored');
                    // idOfDeletedElement = dataStored[lengthPrev];
                    // dataStored.splice(lengthPrev, 1);
                    // loggedInUser.set('dataStored', dataStored)
                    // loggedInUser.save();
                });
            })

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
            $('.current .operation-buttons .btn-save-note').addClass('btn-current-save-note');
            initialSaveNote()
            $('.btn-add-note').prop("disabled", true);
            $('.current .btn-save-note').prop("disabled", false);
            $('.current .btn-edit-note').prop("disabled", true);
            editNote();
        });

        function initialSaveNote() {
            $('.btn-current-save-note').on('click', function () {
                count++;
                var noteData = {
                    title: ($('.current .note-title').val()),
                    content: ($('.current .note-content').val()),
                    position: count
                }
                data.notes.initialSaveNote(noteData)
                    .then(function (note) {
                        updateDOMAfterSave(note)
                        toastr.success("Note saved!")
                        // var user = Parse.User.current();
                        // user.add("dataStored", note.id);
                        // user.save();
                        var collectionFromStorage = localStorage.getItem('dataStored');
                        collectionFromStorage = (collectionFromStorage === null) ? [] : JSON.parse(collectionFromStorage);
                        collectionFromStorage.push(note.id);
                        localStorage.setItem('dataStored', JSON.stringify(collectionFromStorage));

                        // Temporary fix for editing notes issue
                        window.location.reload(true);

                        $('.btn-save-note').removeClass('btn-current-save-note')

                    }, function () {
                        toastr.error("Unsuccessful adding of a note!")
                    })
            })
        }

        function editNote() {
            $('.btn-edit-note').on('click', function () {
                var $this = $(this);
                $this.parent().parent().parent().addClass('current');

                $('.btn-delete-note').prop("disabled", true);
                $('.btn-edit-note').prop("disabled", true);
                $('.current .btn-save-note').prop("disabled", false);

                // Getting the current data from the edited note
                var currentTitle = $('.current .panel-title').html();
                var currentContent = $('.current .panel-body').html();

                // removing the note elements and adding int the note the elements for editing - input field and textarea
                $('.current .panel-heading').remove();
                $('.current .panel-body').remove();
                $('.current').prepend('<div class="adding-body"/>')
                $('.current .adding-body').append('<textarea style="resize:none" rows="4"/>');
                $('.current .adding-body textarea').addClass('note-content form-control').val(currentContent);
                $('.current').prepend('<div class="adding-heading"/>');
                $('.current .adding-heading').append('<input type="text" />');
                $('.current .adding-heading input').addClass('note-title form-control').val(currentTitle);
            });
        }


        function updateDOMAfterSave(){
            var noteTitle = $('.current .note-title').val();
            var noteContent = $('.current .note-content').val();
            $('.current .btn-save-note').prop("disabled", true);
            $('.btn-edit-note').prop("disabled", false);
            $('.btn-add-note').prop("disabled", false);
            $('.btn-delete-note').prop("disabled", false);
            $('.current .adding-heading').remove();
            $('.current .adding-body').remove();
            $('.current')
                .prepend('<div class="panel-body"/>')
                .prepend('<div class="panel-heading"/>')
                .addClass('note')
                .addClass('panel')
                .addClass('panel-primary')
                //.appendTo($('.notes-container'));
            $('.current .panel-heading').append('<h3 class="panel-title"/>');
            $('.current .panel-title').html(noteTitle);
            $('.current .panel-body').html(noteContent);
            $('.notes-container').children().removeClass('current');
        }

        $('#btn-logout').on('click', function () {
            var collectionFromStorage = localStorage.getItem('dataStored');
            collectionFromStorage = (collectionFromStorage === null) ? [] : JSON.parse(collectionFromStorage);
            var user = Parse.User.current();
            user.unset("dataStored");
            user.set("dataStored", []);
            user.save();
            for (var i = 0; i < collectionFromStorage.length; i+=1) {
                user.add("dataStored", collectionFromStorage[i]);
                user.save();
                var noteData = {
                    position: i + 1,
                    id: collectionFromStorage[i]
                }
                data.notes.saveNotesPositions(noteData);
            }


            Parse.User.logOut();
            localStorage.clear();
            context.redirect('#/');
        });


        function appendingButtons() {
            $('.current .operation-buttons').append('<div class="col-md-offset-3 col-sm-3"><button class="btn btn-md btn-success form-control btn-save-note" disabled>Save</div>')
                .append('<div class="col-sm-3"><button class="btn btn-md btn-primary form-control btn-edit-note">Edit</button></div>')
                .append('<div class="col-sm-3"><button class="btn btn-md btn-danger form-control btn-delete-note">Delete</button></div>')
        }
     }
    return {
        getNotes: getNotes
    };
}();


