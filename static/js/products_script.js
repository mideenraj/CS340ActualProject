

// Global variable
var baseURL = "http://flip3.engr.oregonstate.edu:1027/"



// Master event listener (Page Load)
document.addEventListener('DOMContentLoaded', async () => {
    console.log("TEST_2 !!!")
    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});




// ----------------- Function(s) block -----------------
// Function 1: 'Update' button callback function
async function update_product (){

    if (document.getElementById('editBlock')){
        return
    }


    // -------- Step 1: store ID of row to edit
    productID = this.id


    // -------- Step 2: Determine row to edit
    all_rows = document.querySelectorAll(".product_row")
    for (var row of all_rows){
        if (row.id == productID){
            rowToEdit = row
            break
        }       
    }


    // -------- Step 3: Create and display the edit block
    // --Access current value of respective rows in selected row
    rowCells = rowToEdit.children
    var old_name = rowCells.item(1).textContent
    var old_dID = rowCells.item(2).textContent
    var old_price = rowCells.item(3).textContent
    var old_unit = rowCells.item(4).textContent

    // --Create edit row
    var editRow = document.createElement('tr')              //New row
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
        // --6. 'Make Change' Button
    var makeChange = document.createElement('button')
    makeChange.id = "submit_edit" + productID
    makeChange.className
    makeChange.textContent = "Make Change"
    makeChange.style.backgroundColor = "yellow"
    makeChange.style.width = "100%"
    makeChange.style.height = "100%"
    editRow.appendChild(makeChange)

    // --Append row to Table (right underneath the row that is being edited)
    rowToEdit.insertAdjacentElement('afterend', editRow)


    // -------- Step 4: Assign listener to 'Make Change' button
    document.getElementById(makeChange.id).addEventListener('click', submit_edit)
};



// Function 2: Log edit callback function
async function submit_edit(){
    // id of editrow == 'editBlock' (Use this to delete entire row after edit has been made)
    // id of row being edited == last index of event button's id value (Use this to finally change the displayed data)

    // -------- Step 1: access modified values and initialze layload
    var payload = {};
    payload.action = "update"
    payload.ID = this.id[this.id.length - 1]
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