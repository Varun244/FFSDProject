const dairy =
    [
        {
            p_id: "1.html",
            product_name: "Amul Butter",
            product_image: "images/Dairy/amul-butter.jpg",
            product_quantiy: "250gm"
        },
        {
            p_id: "2.html",
            product_name: "Amul Ghee",
            product_image: "images/Dairy/amul-ghee.jpg",
            product_quantiy: "500gm"
        },
        {
            p_id: "3.html",
            product_name: "Paras Ghee",
            product_image: "images/Dairy/paras-ghee.jpg",
            product_quantiy: "500gm"
        },
        {
            p_id: "4.html",
            product_name: "Parle Rusk Iliachi toast",
            product_image: "images/Dairy/parle-iliachi-ruck-toast.jpg",
            product_quantiy: "250gm"
        },
        {
            p_id: "5.html",
            product_name: "Amul Cheese block",
            product_image: "images/Dairy/amul-cheese-block-200-g-carton-product-images-o490001401-p490001401-0-202203150318.jpg",
            product_quantiy: "200gm"
        },
        {
            p_id: "6.html",
            product_name: "Amul Coconut Butter Cookies",
            product_image: "images/Dairy/amul-coconut-butter-cookies-50-g-product-images-o491188795-p590124655-0-202203171137.jpg",
            product_quantiy: "50gm"
        },
        {
            p_id: "7.html",
            product_name: "Britannia Cheese Slices",
            product_image: "images/Dairy/britannia-cheese-slices-200-g-pack-product-images-o490001395-p490001395-0-202203150159.jpg",
            product_quantiy: "100gm"
        },
        {
            p_id: "8.html",
            product_name: "Britannia Traet Coco Cream Croissant",
            product_image: "images/Dairy/britannia-treat-coco-creme-croissant-45-g-product-images-o491552927-p491552927-0-202203151012.jpg",
            product_quantiy: "45gm"
        },
        {
            p_id: "9.html",
            product_name: "Parle Rola Cola Candy",
            product_image: "images/Dairy/parle-rola-cola-candy-100-g-product-images-o491642001-p590110137-0-202203170340.jpg",
            product_quantiy: "100gm",
        }
    ];




const container = document.querySelector('#container1');
const row = document.createElement('div');
row.classList.add('row');
row.id = "product-page";
dairy.forEach(function (dairy) {
    const product = `
    <div class="col-lg-3 col-md-3 col-sm-4">
    <a href="Items/${dairy.p_id}">
               <div class="card rounded" id="p-card">
               <img src="${dairy.product_image}" class="card-img-top">
               <div class="card-body">
                   <h5 class="card-title text-truncate">${dairy.product_name}</h5>
                   <span class="card-text">${dairy.product_quantiy}</span></br>
                   <a href="#" id="cart-btn" class="btn btn-primary" ><i class="fa fa-cart-arrow-down"> Add to Cart</i></a>
               </div>
                </div>
                </div>`;
    row.innerHTML += product;
});
container.appendChild(row);

//product page



