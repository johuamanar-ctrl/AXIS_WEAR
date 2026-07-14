document.addEventListener("DOMContentLoaded", () => {

    // ===== BUSCADOR =====

    const inputSearch = document.getElementById("inputSearch");
    console.log(inputSearch) 
    const boxSearch = document.getElementById("box-search");

    if (!inputSearch || !boxSearch) return;

    inputSearch.addEventListener("keyup", function () {

        let filter = inputSearch.value.toUpperCase();

        let li = boxSearch.getElementsByTagName("li");

        let resultados = false;

        for(let i=0;i<li.length;i++){

            let texto = li[i].textContent.toUpperCase();

            if(texto.indexOf(filter)>-1){

                li[i].style.display="";

                resultados=true;

            }else{

                li[i].style.display="none";

            }

        }

        if(filter==""){

            boxSearch.style.display="none";

        }else{

            boxSearch.style.display=resultados?"block":"none";

        }
        
    });

});