$(document).ready(function(){
    $('.deleteUser').on('click',deleteUser)
})

function deleteUser(){
    let confirmation = confirm('Are you sure you want to delete the user');

    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url : '/users/delete/'+ $(this).data('id')
        })
        .done(function(res){
            window.location.replace('/');
        });
        window.location.replace('/');
    }
    else{
        return false;
    }
}