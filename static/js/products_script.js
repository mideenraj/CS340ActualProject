

// Global variable
var baseURL = "http://flip3.engr.oregonstate.edu:1027/"



// Master event listener (Page Load)
document.addEventListener('DOMContentLoaded', async () => {
    console.log("TEST_2 !!!")

    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

    //'Delete' button event listener(s)
    document.querySelectorAll(".delete_button").forEach(item => {item.addEventListener('click', delete_product)});

    //'Add product' button event listener
    document.querySelector("#insert_product").addEventListener('click', add_product);

});




// ---------------------------------- Function(s) block ----------------------------------
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
    // id of editrow == 'editBlock' (Use this to delete entire row after edit has been made)
    // id of row being edited == last index of event button's id value (Use this to finally change the displayed data)

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
    var url = baseURL + "products"
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
        if (row.id == productID){
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
    var url = baseURL + 'products'
    var payload = {"rowToDelete": this.id, "action":"delete"}
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    console.log(data)


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

// Function 5: 'New Product' callback function (Adds a new product to database)
async function add_product(){
    console.log("TRIGERED")

    // -------- Step 1: Formulate and make request
    var url = baseURL + "products"
    var payload = {
        "action" : "insert",
        "name" : document.getElementById("new_name").value,
        "department" : document.getElementById("new_department").value,
        "price" : document.getElementById("new_price").value,
        "unit" : document.getElementById("new_unit").value
    }
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    console.log("TEST_1:", data)        // Debugging

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
    button_cell.style.height = "100%"
    button_cell.style.width = "100%"

    var update_butt = document.createElement('button')
    update_butt.setAttribute('class', 'update_button')
    update_butt.setAttribute('id', data['productID'])
    button_cell.append(update_butt)
    update_butt.style.width = "50%"
    update_butt.style.height = "100%"

    var delete_butt = document.createElement('button')
    delete_butt.setAttribute('class', 'delete_button')
    delete_butt.setAttribute('id', data['productID'])
    delete_butt.style.width = "50%"
    delete_butt.style.height = "100%"
    button_cell.append(delete_butt)

    new_row.append(button_cell)

        // --Append row to table
    input_row.insertAdjacentElement('beforebegin', new_row)


    // -------- Step 3: Add event listeners for the new buttons
        // --Update button
    update_butt.addEventListener('click', update_product)


        // --Delete button
    delete_butt.addEventListener('click', delete_product)



    // -------- Step 4: Clear input boxes
    document.getElementById("new_name").value = ""
    document.getElementById("new_department").value = ""
    document.getElementById("new_price").value = ""
    document.getElementById("new_unit").value = ""











}