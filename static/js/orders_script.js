

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

    // ---Step 1: Get customer ID of customer making the purchase
    var customerID = document.querySelector("#customer").value        
    
    // ---Step 2: Get products and their respective quantities being purchased
    var allProducts = document.querySelectorAll(".product_quantity")
    selectedProducts = []
    for (var pro of allProducts){
        if (pro.value != 0){
            var p_data = (pro.id, pro.value)
            selectedProducts.push(p_data)
        }
    }

    console.log("TEST_2", selectedProducts)








}
