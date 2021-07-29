

console.log("YES");

document.addEventListener('DOMContentLoaded', async () => {
    //'Update' button event listener(s)
    console.log("YES");
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_product)});

});








// ----------------- Function(s) block -----------------
// Function 1: Update product callback function
async function update_product (){
    console.log("THIS IS A TEST!")
    console.log(this.id)
}