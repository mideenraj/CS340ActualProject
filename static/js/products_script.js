


document.addEventListener('DOMContentLoaded', async () => {
    console.log("TEST_2 !!!")
    //'Update' button event listener(s)
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});








// ----------------- Function(s) block -----------------
// Function 1: Update product callback function
async function update_product (){
    productID = this.id
    this.id = "test"

    // Change color and text of 'update' button that was clicked
    this.style.backgroundcolor = "yellow"
    this.textontent = "Change"








};