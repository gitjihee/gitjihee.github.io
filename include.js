function includeHTML(){
    let $include, $el, fileUrl, xhttp;
    $include = document.getElementsByTagName("*");
    for(let i = 0; i< $include.length; i++){
        $el = $include[i];
        fileUrl = $el.getAttribute("data-include");
        if(fileUrl){
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){

                if(this.readyState == 4){
                    if(this.status == 200) {$el.innerHTML = this.responseText}
                    if(this.status == 404) {$el.innerHTML = "page not found"}
                    $el.removeAttribute("data-include");
                    includeHTML();
                }
            }

            xhttp.open("GET", fileUrl, true);
            xhttp.send();
            return false;
        }
    }
}

window.addEventListener('DOMContentLoaded', includeHTML)

