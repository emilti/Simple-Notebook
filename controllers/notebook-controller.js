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
            });
    }

    return {
        getNotes: getNotes
    };
}();


