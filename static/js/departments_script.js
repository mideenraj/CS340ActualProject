

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



// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    // 'Submit' button event listener
    document.querySelector("#submit_button").addEventListener('click', addDepartment);

    

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: Add a department
async function addDepartment(){

    // -------- Step 1: Formulate and make request
    var url = departments_subpage
    var payload = {
        "action" : "insert",
        "name" : document.getElementById("input_department").value

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
    new_row.setAttribute('class', 'department_row')
    new_row.setAttribute('id', data['departmentID'])

        // --Create ID cell
    var id_cell = document.createElement('td')
    id_cell.textContent = data['departmentID']
    new_row.appendChild(id_cell)

        // --Create Name cell
    var name_cell = document.createElement('td')
    name_cell.textContent = data['name']
    new_row.appendChild(name_cell)


    /*
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
    */

    input_row.insertAdjacentElement('beforebegin', new_row)  // --Append row to table

    /*
    // -------- Step 3: Add event listeners for the new buttons
    update_butt.addEventListener('click', update_product)
    delete_butt.addEventListener('click', delete_product)
    */

    // -------- Step 4: Clear input boxes
    document.getElementById("new_name").value = ""
    document.getElementById("new_department").value = ""


    


}
