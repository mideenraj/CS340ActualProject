


document.addEventListener('DOMContentLoaded', async () => {
    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});








// ----------------- Function(s) block -----------------
// Function 1: Update product callback function
async function update_product (){
    productID = this.id

    // Step 1: Select row that was selected to be edited
    productRow = document.querySelectorAll(".product_row")
    for (var row of productRow){
        if (row.id == productID){
            rowToEdit = row
            break
        }
    }

    // Step 2: xxx
    rowToEdit.style.backgroundcolor = 'yellow'








};