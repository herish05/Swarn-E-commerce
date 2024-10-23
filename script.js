
const navbar = document.querySelector('.nav');
const placeholder = document.querySelector('.nav-placeholder');

window.addEventListener('scroll', function() {
    if (window.scrollY > 41) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.width = '100%';
        placeholder.style.display = 'block'; // Show the placeholder
    } else {
        navbar.style.position = 'relative';
        placeholder.style.display = 'none'; // Hide the placeholder
    }
});

function calculateCartIcon(){
    let cartIcon = document.getElementById('cart-icon');
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    console.log(cartData)
    cartIcon.innerText=(cartData.map((x)=>x.quantity)).reduce((x,y)=>x+y,0)
    
}

calculateCartIcon();



