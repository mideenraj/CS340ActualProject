

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 1     // Choose the server you're using (1, 2, or 3)
var port_num = 10027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"



module.exports = {
    baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`,
    "customers_subpage" : baseURL + "customers",
    "orders_subpage" : baseURL + "orders",
    "products_subpage" : baseURL + "products",
    "departments_subpage" : baseURL + "departments",
    "seasons_subpage" : baseURL + "seasons"
}