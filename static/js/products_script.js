

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




// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

    //'Delete' button event listener(s)
    document.querySelectorAll(".delete_button").forEach(item => {item.addEventListener('click', delete_product)});

    //'Add product' button event listener
    document.querySelector("#insert_product").addEventListener('click', add_product);

    //'Search' button evet listener
    document.querySelector('#search_button').addEventListener('click', search_product);

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: 'Update' button callback function
async function update_product (){

    // -------- Step 1: Check if another row is being edited, if so, return
    if (document.getElementById('editBlock')){
        return
    }

    // -------- Step 2: store ID of row to edit
    productID = this.id

    // -------- Step 3: Determine row to edit
    all_rows = document.querySelectorAll(".product_row")
    for (var row of all_rows){
        if (row.id == productID){
            rowToEdit = row
            break
        }       
    }

    // -------- Step 4: Create and display the edit block
    // --Access current value of respective rows in selected row
    rowCells = rowToEdit.children
    var old_name = rowCells.item(1).textContent
    var old_dID = rowCells.item(2).textContent
    var old_price = rowCells.item(3).textContent
    var old_unit = rowCells.item(4).textContent

    // --Create edit row
    var editRow = document.createElement('tr')           //New row
    editRow.setAttribute('id', 'editBlock')

    // --Modify and append elements to edit row
        // --1. PlaceHolder (for productID column)
    var placeholderCell = document.createElement('td')
    editRow.appendChild(placeholderCell)
        // --2. Name
    var nameEditCell = document.createElement('td')      
    var nameInputBox = document.createElement('input')  
    nameInputBox.setAttribute('id', 'newName')
    nameInputBox.setAttribute('type', 'text')
    nameInputBox.setAttribute('value', old_name)
    nameInputBox.style.backgroundColor = "yellow"
    nameEditCell.appendChild(nameInputBox)
    editRow.appendChild(nameEditCell)
        // --3. DepartMent ID
    var departmentEditCell = document.createElement('td')      
    var departmentInputBox = document.createElement('input')  
    departmentInputBox.setAttribute('id', 'newDepartment')  
    departmentInputBox.setAttribute('type', 'text')
    departmentInputBox.setAttribute('value', old_dID)
    departmentInputBox.style.backgroundColor = "yellow"
    departmentEditCell.appendChild(departmentInputBox)
    editRow.appendChild(departmentEditCell)
        // --4. Sale Price
    var priceEditCell = document.createElement('td')     
    var priceInputBox = document.createElement('input')  
    priceInputBox.setAttribute('id', 'newPrice')    
    priceInputBox.setAttribute('type', 'text')
    priceInputBox.setAttribute('value', old_price)
    priceInputBox.style.backgroundColor = "yellow"
    priceEditCell.appendChild(priceInputBox)
    editRow.appendChild(priceEditCell)
        // --5. Unit Type
    var unitEditCell = document.createElement('td')
    var unitInputBox = document.createElement('input')
    unitInputBox.setAttribute('id', 'newUnit')
    unitInputBox.setAttribute('type', 'text')
    unitInputBox.setAttribute('value', old_unit)
    unitInputBox.style.backgroundColor = "yellow"
    unitEditCell.appendChild(unitInputBox)
    editRow.appendChild(unitEditCell)
        // --6. Make 'Change' Button
    var makeChange = document.createElement('button')
    makeChange.id = "submit_edit" + productID           // Store ID of edit row at end of row
    makeChange.textContent = "Change"
    makeChange.style.backgroundColor = "yellow"
    makeChange.style.width = "50%"
    makeChange.style.height = "100%"
    editRow.appendChild(makeChange)
        // --7. Make 'Cancel' Button
    var cancelChange = document.createElement('button')
    cancelChange.id = 'cancel_edit'
    cancelChange.textContent = "Cancel"
    cancelChange.style.backgroundColor = "yellow"
    cancelChange.style.width = "50%"
    cancelChange.style.height = "100%"
    editRow.appendChild(cancelChange)


        // --Append row to Table (right underneath the row that is being edited)
    rowToEdit.insertAdjacentElement('afterend', editRow)


    // -------- Step 5: Assign listener to 'Change' and 'Cancel' Buttons
    document.getElementById(makeChange.id).addEventListener('click', submit_edit)
    document.getElementById(cancelChange.id).addEventListener('click', cancel_edit)
};

// Function 2: 'Change' button's callback function
async function submit_edit(){

    // -------- Step 1: access modified values and initialze layload
    var payload = {};
    payload.action = "update"
    if (this.id.length == 12){          // If ID is 1 digit
        payload.ID = this.id[this.id.length - 1]
    } else {                            // If ID is 2 digits
        payload.ID = this.id.slice(11, 13)
    }
                
    payload.name = document.getElementById("newName").value
    payload.department = document.getElementById("newDepartment").value
    payload.price = document.getElementById("newPrice").value
    payload.unitType = document.getElementById("newUnit").value


    // -------- Step 2: Formulate request and sent it
    var url = products_subpage
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    // console.log("!!! Server response:", data)       // For debugging

    // -------- Step 3: Update the displayed data
        // -- First, access the row to update
    all_rows = document.querySelectorAll(".product_row")
    for (var row of all_rows){
        if (row.id == payload.ID){
            rowToEdit = row
            break
        }       
    }
    // -- Second, edit the row
    rowCells = rowToEdit.children
    rowCells.item(0).textContent = data['productID']
    rowCells.item(1).textContent = data['productName']
    rowCells.item(2).textContent = data['departmentID']
    rowCells.item(3).textContent = data['salePrice']
    rowCells.item(4).textContent = data['unitType']


    // -------- Step 4: Delete the Edit row
    document.getElementById("editBlock").remove()


}

// Function 3:'Cancel' button's callback function (Cancels an edit)
async function cancel_edit(){
    document.getElementById("editBlock").remove()
}

// Function 4: 'Delete' button's callback function (deletes a row)
async function delete_product(){

    // -------- Step 1: Make request to delete row from databse
    var url = products_subpage
    var payload = {"rowToDelete": this.id, "action":"delete"}
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()


    // -------- Step 2: Delete row from HTML
    all_rows = document.querySelectorAll(".product_row")
    for (var row of all_rows){
        if (row.id == this.id){
            rowToDelete = row
            rowToDelete.remove()
            break
        }       
    }
}

// Function 5: 'Add Product' button's callback function (Adds a new product to database)
async function add_product(){

    // -------- Step 1: Formulate and make request
    var url = products_subpage
    var payload = {
        "action" : "insert",
        "name" : document.getElementById("new_name").value,
        "department" : document.getElementById("new_department").value,
        "price" : document.getElementById("new_price").value,
        "unit" : document.getElementById("new_unit").value
    }

    // Function returns if any fields were left empty
    if (payload['name'].length == 0 || payload['department'].length == 0 || payload['price'].length == 0 || payload['unit'].length == 0){
        return
    }


    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()

    // -------- Step 2: Append data to table (By creating new row with the returned response)
    var input_row = document.getElementById("input_row")        // Get the row before which the new row will be inserted
    var new_row = document.createElement("tr")
    new_row.setAttribute('class', 'product_row')
    new_row.setAttribute('id', data['productID'])
        // --Create productID cell
    var id_cell = document.createElement('td')
    id_cell.textContent = data['productID']
    new_row.appendChild(id_cell)

        // --Create productName cell
    var name_cell = document.createElement('td')
    name_cell.textContent = data['productName']
    new_row.appendChild(name_cell)

        // --Create departmentID cell
    var department_cell = document.createElement('td')
    department_cell.textContent = data['departmentID']
    new_row.appendChild(department_cell)

        // --Create salePrice cell
    var price_cell = document.createElement('td')
    price_cell.textContent = data['salePrice']
    new_row.appendChild(price_cell)

        // --Create unitType cell
    var unit_cell = document.createElement('td')
    unit_cell.textContent = data['unitType']
    new_row.appendChild(unit_cell)

        // --Create Modify cell (Buttons)
    var button_cell = document.createElement('td')
        // --Update Button
    var update_butt = document.createElement('button')
    update_butt.setAttribute('class', 'update_button')
    update_butt.setAttribute('id', data['productID'])
    update_butt.textContent = "Update"
    button_cell.append(update_butt)
        // --Delete Button
    var delete_butt = document.createElement('button')
    delete_butt.setAttribute('class', 'delete_button')
    delete_butt.setAttribute('id', data['productID'])
    delete_butt.textContent = "Delete"
    button_cell.append(delete_butt)

    new_row.append(button_cell)

    input_row.insertAdjacentElement('beforebegin', new_row)  // --Append row to table

    // -------- Step 3: Add event listeners for the new buttons
    update_butt.addEventListener('click', update_product)
    delete_butt.addEventListener('click', delete_product)

    // -------- Step 4: Clear input boxes
    document.getElementById("new_name").value = ""
    document.getElementById("new_department").value = ""
    document.getElementById("new_price").value = ""
    document.getElementById("new_unit").value = ""

}

// Function 6: 'Search' buttons' callback function
async function search_product(){

    // ----- Step 1: Access each input box
    var idSearch = document.getElementById('searchByID')
    var nameSearch = document.getElementById('searchByName')
    var priceSearch = document.getElementById('searchByPrice')

    // If all search boxes are empty, return
    if (idSearch.value.length == 0 && nameSearch.value.length == 0 && priceSearch.value.length == 0){
        return
    }


    // ----- Step 2: Sent reqeust based on conditionals
    var url = products_subpage

    if (idSearch.value != ""){
        var payload = {
            "action" : "search",
            "searchBy" : "id",
            "id" : idSearch.value
        }
        var fetchdata = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type' : 'application/json'}
        }

    } else if (nameSearch.value != ""){
        var payload = {
            "action" : "search",
            "searchBy" : "name",
            "name" : nameSearch.value
        }
        var fetchdata = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type' : 'application/json'}
        }

    } else if (priceSearch.value != ""){
        var payload = {
            "action" : "search",
            "searchBy" : "price",
            "price" : priceSearch.value
        }
        var fetchdata = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type' : 'application/json'}
        }
    }

    // ----- Step 3: Access search results from server
    var response = await fetch(url, fetchdata)
    var data = await response.json()

    // ----- Step 4: Display results
        // First, delete any existing rows in search display table
    var existingSearchResults = document.querySelectorAll(".searchResult")
    for (var tr of existingSearchResults){
        tr.remove()
    }

        // Second, populate table
    for (var row of data["rows"]){
        var new_row = document.createElement('tr')
        new_row.setAttribute('class', 'searchResult')
        var id_cell = document.createElement('td')
        id_cell.textContent = row['productID']
        new_row.appendChild(id_cell)
        var name_cell = document.createElement('td')
        name_cell.textContent = row['productName']
        new_row.appendChild(name_cell)
        var dep_cell = document.createElement('td')
        dep_cell.textContent = row['departmentID']
        new_row.appendChild(dep_cell)
        var price_cell = document.createElement('td')
        price_cell.textContent = row['salePrice']
        new_row.appendChild(price_cell)
        var unit_cell = document.createElement('td')
        unit_cell.textContent = row['unitType']
        new_row.appendChild(unit_cell)

        var searchtableRows = document.querySelector("#searchResultTable")
        searchtableRows.appendChild(new_row)
    }

        // Third, Make table visible (Its hidden by default)
    if (data["rows"].length != 0){
        document.getElementById("searchResultTable").style.display = "inline-block"
    } else {
        document.getElementById("searchResultTable").style.display = "none"
    }

        // Fourth, Erase all input box values
    document.getElementById("searchByID").value = ""
    document.getElementById("searchByName").value = ""
    document.getElementById("searchByPrice").value = ""
}
