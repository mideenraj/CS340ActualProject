

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 2     // Choose the server you're using (1, 2, or 3)
var port_num = 10027     // Choose a port number of your choice

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


    // Event listener for 'Delete Order' Button
    document.querySelectorAll(".delete_order").forEach(item => {item.addEventListener('click', delete_order)})

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: 'Place Order' button's callback function
async function place_order() {

    // ---Step 1: Get customer ID of customer making the purchase
    var customerID = document.querySelector("#customer").value        
    
    // ---Step 2: Get products and their respective quantities being purchased
    var allProducts = document.querySelectorAll(".product_quantity")
    selectedProducts = []
    var zeroCount = 0
    for (var pro of allProducts){
        if (pro.value == 0) {
            zeroCount++
        } else if (pro.value != 0){
            var p_data = [pro.id, pro.value]
            selectedProducts.push(p_data)
        }
    }

    // ---Step 2.5: Return if all product quantitie are set to 0
    if (allProducts.length == zeroCount){
        return
    }

    // ---Step 3: Store the data and sent request
    var payload = {}
    payload['action'] = 'place'
    payload["customer"] = customerID
    payload["purchases"] = selectedProducts         // 'selectedProducts' will be a list of lists [[productID, quantity], [....]]

    var url = orders_subpage
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }

    var response = await fetch(url, fetchdata)
    var data = await response.json()

    // ---Step 4: Use the returned data to display new row in table
    var rowData = data["lastOrder"]
        // New row
    var newRow = document.createElement('tr')
    newRow.setAttribute('class', 'order_row')
    newRow.setAttribute('id', rowData['orderID'])
        // order ID data cell
    var oID = document.createElement('td')
    oID.textContent = rowData['orderID']
    newRow.appendChild(oID)
        // customer name data cell
    var cID = document.createElement('td')
    cID.textContent = rowData['customerName']
    newRow.appendChild(cID)
        // season name data cell
    var sID = document.createElement('td')
    sID.textContent = rowData['seasonName']
    newRow.appendChild(sID)
        // total cost data cell
    var total = document.createElement('td')
    total.textContent = rowData['totalCost']
    newRow.appendChild(total)
        // total cost data cell
    var del_butt_cell = document.createElement('td')
    var del_butt = document.createElement('button')
    del_butt.setAttribute('class', 'delete_order')
    del_butt.setAttribute('id', rowData['orderID'])
    del_butt.textContent = 'Delete Order'
    del_butt_cell.appendChild(del_butt)
    newRow.appendChild(del_butt_cell)

        //Append row to table
    document.querySelector(".orders").appendChild(newRow)

    // Add event listener to delete button
    del_butt.addEventListener('click', delete_order)

    
    // ---Step 5: Clear all input boxes (default to 0)
    var allProducts = document.querySelectorAll(".product_quantity")
    selectedProducts = []
    for (var pro of allProducts){
        pro.value = 0
    }
}


// Function 2: 'Delete Order' button's callback function
async function delete_order(){

    // Step 1: get ID of row to delete
    var orderToDeleteID = this.id

    // Step 2: send request
    var payload = {}
    payload["action"] = 'delete'
    payload["orderID"] = orderToDeleteID   

    var url = orders_subpage
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    //var data = await response.json()


    // Step 3: delete row from table
    var allrows = document.querySelectorAll(".order_row")
    for (var row of allrows){
        if (row.id == orderToDeleteID){
            row.remove()
        }
    }


}