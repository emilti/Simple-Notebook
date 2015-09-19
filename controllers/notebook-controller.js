var usersController = function() {

    function getNotes(){
        templates.get('notebook')
            .then(function(template) {
                context.$element().html(template());

            });
    }

    return {
        getNotes: getNotes
    };
}();


