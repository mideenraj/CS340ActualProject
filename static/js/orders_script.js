

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 1     // Choose the server you're using (1, 2, or 3)
var port_num = 1027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"



// ------------------- Master event listener (On page Load) -------------------
document.addEventListener('DOMContentLoaded', async () => {

    // Event listener for 'Place Order' Button
    document.querySelector("#place_order_button").addEventListener('click', place_order)

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: 'Place Order' button's callback function
async function place_order() {

    var x = document.querySelector("#customer").value
    console.log("TEST_1:", x)





}