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
                    $('<div />').append('<input type="text" value="" placeholder="title" class="title"/>').
                        append('<textarea class="text-of-notes" placeholder="Enter your note..">').
                        appendTo($('.notes-wrapper .notes-container')).addClass('note');
                    $('.btn-add-note').prop( "disabled", true );
                    $('.btn-save-note').prop( "disabled", false );
                    $('.btn-edit-note').prop( "disabled", false );
                    $('.btn-save-note').on( 'click', function(){

                    });
                });
            });
    }

    return {
        getNotes: getNotes
    };
}();


