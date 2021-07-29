


document.addEventListener('DOMContentLoaded', async () => {
    //'Update' button event listener(s)
    var update_buttons = document.getElementsByClassName("update_button").addEventListener('click', update_product);

})








// ----------------- Function(s) block -----------------

// Function 1: Update product callback function
async function update_product (){
    console.log("THIS IS A TEST!")
    console.log(this.id)
}