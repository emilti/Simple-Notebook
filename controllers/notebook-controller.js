var notebookController = function() {

    function getNotes(context){
        templates.get('notebook')
            .then(function(template) {
                context.$element().html(template());

                $('#btn-logout').on('click', function() {
                        localStorage.removeItem('username');
                        context.redirect('#/');
                    }
                );

                $('.btn-add-note').on('click', function() {
                    $('<div />').append('<input type="text" value="" placeholder="title" class="note-title"/>').
                        append('<textarea class="note-content" placeholder="Enter your note..">').
                        appendTo($('.notes-container')).addClass('note').addClass('current');
                    $('.btn-add-note').prop( "disabled", true );
                    $('.btn-save-note').prop( "disabled", false );
                    $('.btn-edit-note').prop( "disabled", true );
                    $('.btn-save-note').on( 'click', function(){
                        var noteData = {
                            title: ($('.current .note-title').val()),
                            content: ($('.current .note-content').val())
                        }

                        data.notes.addNote(noteData)
                            .then(function(note){
                                $('.btn-save-note').prop( "disabled", true );
                                $('.btn-edit-note').prop( "disabled", false );
                                $('.btn-add-note').prop( "disabled", false )
                                $('.current .note-title').prop("disabled", true);
                                $('.current .note-title').css("border", "0");
                                $('.current .note-content').prop("disabled", true);
                                $('.current .note-content').css("border", "0");
                                $('.notes-container').children().removeClass('current');
                            });

                    });

                });
            });
    }

    return {
        getNotes: getNotes
    };
}();


