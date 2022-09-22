
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    let preview = await fetch('api/v1/urls/preview?url=' + url)
    .then(response => response.text())
    .catch(error => console.log('Error is ' + error)) 

    displayPreviews(preview)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
