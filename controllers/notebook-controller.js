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
                    $('<div />').appendTo($('.notes-wrapper .notes-container')).addClass('note');
                });
            });
    }

    return {
        getNotes: getNotes
    };
}();


