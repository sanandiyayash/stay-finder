
let taxSwitch = document.getElementById("flexSwitchCheckChecked");
taxSwitch.addEventListener("click", () => {
    let taxInfoElements = document.getElementsByClassName("tax-info");
    let priceElements = document.getElementsByClassName("hidden-tax-price");
    let cardPriceElements = document.getElementsByClassName('price-line')
    for (let i = 0; i < taxInfoElements.length; i++) {
        let price = parseInt(priceElements[i].value);
        let tax = (price * 18) / 100;
        let totalPrice = price + tax;

        if (taxInfoElements[i].classList.contains('tax-info-deactive')) {
            taxInfoElements[i].innerHTML = ' +18% GST';
            cardPriceElements[i].classList.remove('price-line-through')

        } else {
            taxInfoElements[i].innerHTML = ` &#8377;${totalPrice.toLocaleString("en-IN")}`;
            cardPriceElements[i].classList.add('price-line-through')
        }

        taxInfoElements[i].classList.toggle('tax-info-deactive');
    }
});
