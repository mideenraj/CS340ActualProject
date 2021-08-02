

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 3     // Choose the server you're using (1, 2, or 3)
var port_num = 10027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"



// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    // 'Add Season' button event listener
    document.querySelector("#submit_button").addEventListener('click', addSeason);

    

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: Add a season
async function addSeason(){

    // -------- Step 1: Formulate and make request
    var url = seasons_subpage
    var payload = {
        "action" : "insert",
        "name" : document.getElementById("sName").value,
        "start" : document.getElementById("sDate").value,
        "end" : document.getElementById("eDate").value
    }
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()





    
}
