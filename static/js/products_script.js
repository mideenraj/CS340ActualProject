


document.addEventListener('DOMContentLoaded', async () => {
    console.log("TEST_2 !!!")
    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});








// ----------------- Function(s) block -----------------
// Function 1: Update product callback function
async function update_product (){
    productID = this.id


    // Determine row to edit
    all_rows = document.querySelectorAll(".product_row")
    for (var row of all_rows){
        if (row.id == productID){
            rowToEdit = row
            break
        }       
    }


    // ------ Step 1: create edit row ------
    // --Access current value of respective rows in selected row
    rowCells = rowToEdit.children
    var old_name = rowCells.item(1).textContent
    var old_dID = rowCells.item(2).textContent
    var old_price = rowCells.item(3).textContent
    var old_unit = rowCells.item(4).textContent

    // --Create elements
    var editRow = document.createElement('tr')              //New row

    // --Modify and append elements
        // --PlaceHolder (for productID column)
    var placeholderCell = document.createElement('td')      //Data cell
    editRow.appendChild(placeholderCell)
        // --Name
    var nameEditCell = document.createElement('td')         //Data cell
    var nameInputBox = document.createElement('input')      //Text box
    nameInputBox.setAttribute('type', 'text')
    nameInputBox.setAttribute('name', 'newName')
    nameInputBox.setAttribute('textContent', old_name)
    nameEditCell.appendChild(nameInputBox)
    editRow.appendChild(nameEditCell)
        // --DepartMent ID
    var departmentEditCell = document.createElement('td')         //Data cell
    var departmentInputBox = document.createElement('input')      //Text box
    departmentInputBox.setAttribute('type', 'text')
    departmentInputBox.setAttribute('name', 'newDepartment')
    departmentInputBox.setAttribute('textContent', old_dID)
    departmentEditCell.appendChild(departmentInputBox)
    editRow.appendChild(departmentEditCell)
        // --Sale Price
    var priceEditCell = document.createElement('td')         //Data cell
    var priceInputBox = document.createElement('input')      //Text box
    priceInputBox.setAttribute('type', 'text')
    priceInputBox.setAttribute('name', 'newPrice')
    priceInputBox.setAttribute('textContent', old_price)
    priceEditCell.appendChild(priceInputBox)
    editRow.appendChild(priceEditCell)
        // --Unit Type
    var unitEditCell = document.createElement('td')         //Data cell
    var unitInputBox = document.createElement('input')      //Text box
    unitInputBox.setAttribute('type', 'text')
    unitInputBox.setAttribute('name', 'newUnit')
    unitInputBox.setAttribute('textContent', old_unit)
    unitEditCell.appendChild(unitInputBox)
    editRow.appendChild(unitEditCell)

    // --Append row to Table (right underneath the row that is being edited)
    rowToEdit.insertAdjacentElement('afterend', editRow)





















};