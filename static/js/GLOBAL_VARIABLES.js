

// This file holds variables that be accessed from all functions of other .js files, regardless of scope.


// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 1     // Choose the server you're using (1, 2, or 3)
var port_num = 1027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseUrl + "customers"
var orders_subpage = baseUrl + "orders"
var products_subpage = baseUrl + "products"
var departments_subpage = baseUrl + "departments"
var seasons_subpage = baseUrl + "seasons"

// ---Step 3: export variables
module.exports = { baseURL, customers_subpage, orders_subpage, products_subpage, products_subpage, departments_subpage, seasons_subpage }