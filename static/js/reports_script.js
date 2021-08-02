

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



// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    // 'Cancel' button event listener
    document.querySelectorAll(".cancelItem").forEach(item => {item.addEventListener('click', cancelOrder)});


    // When product in dropdown in changed
    document.querySelector("#select_productID").addEventListener('change', onProductChange)

    
    // When quantity is changed
    document.querySelector("#select_quantity").addEventListener('keyup', onQuantityChange)

    // When add is clicked
    document.querySelector("#insertItem").addEventListener('click', addItem)
    

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: cancel an order
async function cancelOrder(){


    // ---Step 1: Access the details of cancelling item
    var parentRow = this.parentNode.parentNode
    var kidCells = parentRow.children
    var p_ID = kidCells.item(0).textContent
    var o_ID = kidCells.item(1).textContent
    var season = kidCells.item(2).textContent
    var quantity = kidCells.item(3).textContent
    var itemTotal = kidCells.item(4).textContent
    //console.log(p_ID, o_ID, season, quantity, itemTotal)      // For debugging


    // ---Step 2: Send request to remove item from OrderProducts
    var payload = {
        "action": "cancel",
        "productID": p_ID,
        "orderID": o_ID,
        "seasonID": season,
        "quantitySold": quantity,
        "productTotal": itemTotal
    }
    var url = baseURL
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }

    var response = await fetch(url, fetchdata)
    var data = await response.json()

    // ---Step 2: Delete the row
    parentRow.remove()


    


}

// Function 2:
async function onProductChange(){

    // Step 1: get price of selected product
    var url = baseURL
    payload = {
        "action":"getPrice",
        'product': this.value
    }
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    var price = data['salePrice']

    // Step 2: calculate total cost using price x quantity
    var quantity = document.querySelector("#select_quantity").value
    console.log(quantity)
    console.log(price)
    var total = (quantity*price).toFixed(2)

    
    // Step 3: display total
    document.querySelector("#totalPrice").textContent = total



}

// Function 3:
async function onQuantityChange(key){


    // Continue only if a number key was pressed (Keycode range: [48, 57])
    if (key.keyCode >= 48 && key.keyCode <= 57){
        console.log(String.fromCharCode(key.keyCode))


        // Step 1: Access quantity value
        var quantity = document.querySelector("#select_quantity").value

        // Step 2: Access current product
        var product = document.querySelector("#select_productID").value

        // Step 2: Get price of currently selected product
        var url = baseURL
        payload = {
            "action":"getPrice",
            'product': product
        }
        var fetchdata = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type' : 'application/json'}
        }
        var response = await fetch(url, fetchdata)
        var data = await response.json()
        console.log(data)
        var price = data['salePrice']


        // Step 3: display total
        var total = (quantity*price).toFixed(2)
        document.querySelector("#totalPrice").textContent = total




    }

    


}

// Function 4:
async function addItem(){

    // Step 1: Access choosen order/season IDs
    var orderID = document.querySelector("#select_orderID").value
    var seasonID = document.querySelector("#select_seasonID").value

    // Step 2: check if order/season pair exist in log
    var existence = false
    var logs = document.querySelectorAll(".item_row")
    for (var row of logs){
        // Get all children of the current row
        var cells = row.children

        // Compare with selected pair
        console.log("ROWS:", cells.item(1).textContent, cells.item(2).textContent)
        if (cells.item(1).textContent == orderID && cells.item(2).textContent == seasonID){
            existence = true
            break
        }
    }

    
    // Step 3: exit if the pair does not exist, else continue
    if (existence == false){
        return
    }
    

    // Step 4: Exit if quantity is 0
    var quantity = document.querySelector("#select_quantity").value
    if (quantity == 0 || quantity == ""){
        return
    }


    // Step 5: get price of product
    var product = document.querySelector("#select_productID").value

    var url = baseURL
        payload = {
            "action":"getPrice",
            'product': product
        }
        var fetchdata = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type' : 'application/json'}
        }
        var response = await fetch(url, fetchdata)
        var data = await response.json()
        var price = data['salePrice']


    // Step 6: Insert order into database
    var productName = document.querySelector("#select_productID").value
    var oid = document.querySelector("#select_orderID").value
    var sid = document.querySelector("#select_seasonID").value
    var quantity = document.querySelector("#select_quantity").value
    var total = (price*quantity).toFixed(2)
    var payload = {
        "action": "insertItem",
        "product": productName,
        "oid": oid,
        "sid": sid,
        "quantity": quantity,
        "total": total
    }
    var url = baseURL
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var response = await response.json()


    // Step 6: insert new row into table
        // row
    var newRow = document.createElement('tr')
    newRow.setAttribute('class', 'item_row')

        // pid
    var product_cell = document.createElement('td')
    product_cell.textContent = response['product']
    newRow.appendChild(product_cell)

        // oid
    var oid_cell = document.createElement('td')
    oid_cell.textContent = response['oid']
    oid_cell.setAttribute('id', 'oID')
    newRow.appendChild(oid_cell)

        // sid
    var sid_cell = document.createElement('td')
    sid_cell.textContent = response['sid']
    sid_cell.setAttribute('id', 'sID')
    newRow.appendChild(sid_cell)

        // quantity
    var quantity_cell = document.createElement('td')
    quantity_cell.textContent = response['quantity']
    newRow.appendChild(quantity_cell)

        // total
    var total_cell = document.createElement('td')
    total_cell.textContent = response['total']
    newRow.appendChild(total_cell)

        // cancel button
    var button_cell = document.createElement('td')
    var button_cancel = document.createElement('button')
    button_cancel.setAttribute('class', 'cancelItem')
    button_cancel.setAttribute('id', response['oid'])
    button_cancel.textContent = 'Cancel'
    button_cell.appendChild(button_cancel)
    newRow.appendChild(button_cell)
    button_cancel.addEventListener('click', cancelOrder)
    console.log("BUTTON:", button_cancel)


    // Find input row
    var input_row = document.querySelector("#input_row")
    input_row.insertAdjacentElement('beforebegin', newRow)  // --Append row to table


    // Step 6: Update order total
    var payload = {
        "action": "updateTotal",
        "oid": oid,
        "total": total
    }
    var url = baseURL
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var response = await response.json()





    




}