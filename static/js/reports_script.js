

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



// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    // 'Cancel' button event listener
    document.querySelectorAll(".cancelItem").forEach(item => {item.addEventListener('click', cancelOrder)});

    

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: cancel an order
async function cancelOrder(){

    // ---Step 1: Access the OrderID and productID of cancelling item
    var parentNode = this.parentNode.parentNode
    console.log("Test_3:", parentNode)


}
