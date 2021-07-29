


document.addEventListener('DOMContentLoaded', async () => {
    console.log("TEST_2 !!!")
    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});








// ----------------- Function(s) block -----------------
// Function 1: Update product callback function
async function update_product (){


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

    // --Modify and append elements to edit row
        // --1. PlaceHolder (for productID column)
    var placeholderCell = document.createElement('td')      //Data cell
    editRow.appendChild(placeholderCell)
        // --2. Name
    var nameEditCell = document.createElement('td')         //Data cell
    var nameInputBox = document.createElement('input')      //Text box
    nameInputBox.setAttribute('type', 'text')
    nameInputBox.setAttribute('name', 'newName')
    nameInputBox.setAttribute('value', old_name)
    nameInputBox.style.backgroundColor = "yellow"
    nameEditCell.appendChild(nameInputBox)
    editRow.appendChild(nameEditCell)
        // --3. DepartMent ID
    var departmentEditCell = document.createElement('td')         //Data cell
    var departmentInputBox = document.createElement('input')      //Text box
    departmentInputBox.setAttribute('type', 'text')
    departmentInputBox.setAttribute('name', 'newDepartment')
    departmentInputBox.setAttribute('value', old_dID)
    departmentInputBox.style.backgroundColor = "yellow"
    departmentEditCell.appendChild(departmentInputBox)
    editRow.appendChild(departmentEditCell)
        // --4. Sale Price
    var priceEditCell = document.createElement('td')         //Data cell
    var priceInputBox = document.createElement('input')      //Text box
    priceInputBox.setAttribute('type', 'text')
    priceInputBox.setAttribute('name', 'newPrice')
    priceInputBox.setAttribute('value', old_price)
    priceInputBox.style.backgroundColor = "yellow"
    priceEditCell.appendChild(priceInputBox)
    editRow.appendChild(priceEditCell)
        // --5. Unit Type
    var unitEditCell = document.createElement('td')         //Data cell
    var unitInputBox = document.createElement('input')      //Text box
    unitInputBox.setAttribute('type', 'text')
    unitInputBox.setAttribute('name', 'newUnit')
    unitInputBox.setAttribute('value', old_unit)
    unitInputBox.style.backgroundColor = "yellow"
    unitEditCell.appendChild(unitInputBox)
    editRow.appendChild(unitEditCell)
        // --6. Log Edit Button
    var makeChange = document.createElement('button')
    makeChange.id = "submit_edit"
    makeChange.textContent = "Make Change"
    makeChange.style.backgroundColor = "yellow"
    editRow.appendChild(makeChange)

    // --Append row to Table (right underneath the row that is being edited)
    rowToEdit.insertAdjacentElement('afterend', editRow)


    // -------- Step 4: Manage the requested edit 








    










};