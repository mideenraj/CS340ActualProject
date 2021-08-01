

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 3     // Choose the server you're using (1, 2, or 3)
var port_num = 10027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"



// ------------------------------------- Master event listener (On page Load) -------------------------------------
document.addEventListener('DOMContentLoaded', async () => {

    // 'Cancel' button event listener
    document.querySelectorAll(".updateCustomer").forEach(item => {item.addEventListener('click', updateCustomer)});

    // 'Delete' button event listener
    document.querySelectorAll(".deleteCustomer").forEach(item => {item.addEventListener('click', deleteCustomer)});

    // 'Submit' button event listener
    document.querySelector("#submit_button").addEventListener('click', insertCustomer);
});









// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: 'Update' button's callback function
async function updateCustomer(){

    // -------- Step 1: Check if another row is being edited, if so, return
    if (document.getElementById('editBlock')){
        return
    }

    // -------- Step 2: store ID of row to edit
    customerID = this.id

    // -------- Step 3: Determine row to edit
    all_rows = document.querySelectorAll(".customer_row")
    for (var row of all_rows){
        console.log("THIS:", row.id)
        if (row.id == customerID){
            console.log("TRIG")
            rowToEdit = row
            break
        }       
    }

    // -------- Step 4: Create and display the edit block
    // --Access current value of respective rows in selected row
    rowCells = rowToEdit.children
    var old_fname = rowCells.item(1).textContent
    var old_lname = rowCells.item(2).textContent
    var old_dob = rowCells.item(3).textContent
    var old_zip = rowCells.item(4).textContent

    // --Create edit row
    var editRow = document.createElement('tr')           //New row
    editRow.setAttribute('id', 'editBlock')

    // --Modify and append elements to edit row
        // --1. PlaceHolder (for productID column)
    var placeholderCell = document.createElement('td')
    editRow.appendChild(placeholderCell)
        // --2. First Name
    var fname_editcell = document.createElement('td')      
    var fname_inputbox = document.createElement('input')  
    fname_inputbox.setAttribute('id', 'new_fname')
    fname_inputbox.setAttribute('type', 'text')
    fname_inputbox.setAttribute('value', old_fname)
    fname_inputbox.style.backgroundColor = "yellow"
    fname_editcell.appendChild(fname_inputbox)
    editRow.appendChild(fname_editcell)
        // --3. Last Name
    var lname_editcell = document.createElement('td')      
    var lname_inputbox = document.createElement('input')  
    lname_inputbox.setAttribute('id', 'new_lname')  
    lname_inputbox.setAttribute('type', 'text')
    lname_inputbox.setAttribute('value', old_lname)
    lname_inputbox.style.backgroundColor = "yellow"
    lname_editcell.appendChild(lname_inputbox)
    editRow.appendChild(lname_editcell)
        // --4. DOB 
    var dob_editcell = document.createElement('td')     
    var dob_inputbox = document.createElement('input')  
    dob_inputbox.setAttribute('id', 'new_dob')    
    dob_inputbox.setAttribute('type', 'text')
    dob_inputbox.setAttribute('value', old_dob)
    dob_inputbox.style.backgroundColor = "yellow"
    dob_editcell.appendChild(dob_inputbox)
    editRow.appendChild(dob_editcell)
        // --5. Zipcode 
    var zip_editcell = document.createElement('td')
    var zip_inputbox = document.createElement('input')
    zip_inputbox.setAttribute('id', 'new_zip')
    zip_inputbox.setAttribute('type', 'text')
    zip_inputbox.setAttribute('value', old_zip)
    zip_inputbox.style.backgroundColor = "yellow"
    zip_editcell.appendChild(zip_inputbox)
    editRow.appendChild(zip_editcell)
        // --6. Make 'Change' Button
    var makeChange = document.createElement('button')
    makeChange.id = "submit_edit" + customerID           // Store ID of edit row at end of row
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

}


// Function 1: 'Delete' button's callback function
async function deleteCustomer(){

    // Step 1: 

}

// Function 3: 'Submit' button's callback function
async function insertCustomer(){

    // Step 1: 

}


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
                
    payload.fname = document.getElementById("new_fname").value
    payload.lname = document.getElementById("new_lname").value
    payload.dob = document.getElementById("new_dob").value
    payload.zip = document.getElementById("new_zip").value


    // -------- Step 2: Formulate request and sent it
    var url = customers_subpage
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
    all_rows = document.querySelectorAll(".customer_row")
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
