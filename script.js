$(document).ready(function(){
    if (sessionStorage.getItem('email') === null) {
        window.open("http://www-audiopost01.s3-website.us-east-2.amazonaws.com/register.html", "_self");
    }

    $('#posts').DataTable();
    refresh()
    

}
)



function refresh(){
    $.ajax({
        url: API_ENDPOINT + '?email=' + sessionStorage.getItem('email'),
        type: 'GET',
        success: function(response) {
            console.log(response)
            var table = $('#posts').DataTable();

            jQuery.each(response, function(i, data) {

                var player = "<audio controls><source src='" + data['url'] + "' type='audio/mpeg'></audio>"

                if (typeof data['url'] === "undefined") {
                    var player = ""
                }
                
                table.row.add($("<tr> \
                    <td>" + data['id'] + "</td> \
                    <td>" + data['voice'] + "</td> \
                    <td>" + data['text'] + "</td> \
                    <td>" + data['status'] + "</td> \
                    <td>" + player + "</td> \
                    </tr>")).draw(false);

            });
            
        },
        error: function() {
            alert("error");
        }
    });
}


var API_ENDPOINT = "https://za2rib0008.execute-api.us-east-2.amazonaws.com/dev"

document.getElementById("sayButton").onclick = function() {

    var inputData = {
        "voice": $('#voiceSelected option:selected').val(),
        "text": $('#postText').val(),
        "email": sessionStorage.getItem("email")
    };

    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data: JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            console.log(response.url)
            var player = new Audio(response["url"]);
            player.play();

            var table = $('#posts').DataTable();
            var audio = "<audio controls><source src='" + response['url'] + "' type='audio/mpeg'></audio>"

            table.row.add($("<tr> \
            <td>" + response['id'] + "</td> \
            <td>" + response['voice'] + "</td> \
            <td>" + response['text'] + "</td> \
            <td>" + response['status'] + "</td> \
            <td>" + audio + "</td> \
            </tr>")).draw(false);
            
        },
        error: function() {
            alert("error");
        }
    });
}

document.getElementById("postText").onkeyup = function() {
    var length = $(postText).val().length;
    document.getElementById("charCounter").textContent = "Characters: " + length;
}

document.getElementById("logout").onclick = function() {
    sessionStorage.clear();
    window.open("http://www-audiopost01.s3-website.us-east-2.amazonaws.com/", "_self");
}