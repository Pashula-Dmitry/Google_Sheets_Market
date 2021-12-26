document.addEventListener("DOMContentLoaded", function () {


    let cart = {};
    let goods = {};

    function loadCartFromStorage() {
        if (localStorage.getItem('cart') != undefined) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

    }

    loadCartFromStorage();

    async function fa(goods) {
        const urlGoogleSheet = "https://spreadsheets.google.com/feeds/list/16V959DYUkqz3ZWiD3AbbDAzuA00qUCnOV52TsHyzcOI/od6/public/values?alt=json";
        try {
            let response = await fetch(urlGoogleSheet);
            let data = await response.json();
            data = data["feed"]["entry"];
            goods = arrayHelper(data);
            document.querySelector(".shop-field").innerHTML = showGoods(goods);
            showCart();

            //let btn = document.querySelectorAll('.act');
            document.onclick = function (e) {
                if (e.target.attributes.name != undefined) {
                    if (e.target.attributes.name.nodeValue == 'add-to-cart') {
                        addToCart(e.target.attributes.data.nodeValue);
                    } else if (e.target.attributes.name.nodeValue == 'delete-goods') {
                        delete cart[e.target.attributes.data.nodeValue];
                        showCart();
                        localStorage.setItem('cart', JSON.stringify(cart));
                    } else if (e.target.attributes.name.nodeValue == 'plus-goods') {
                        cart[e.target.attributes.data.nodeValue]++;
                        showCart();
                        localStorage.setItem('cart', JSON.stringify(cart));
                    } else if (e.target.attributes.name.nodeValue == 'minus-goods') {
                        if (cart[e.target.attributes.data.nodeValue] - 1 == 0) {
                            delete cart[e.target.attributes.data.nodeValue];
                        } else {
                            cart[e.target.attributes.data.nodeValue]--;
                        }
                        showCart();
                        localStorage.setItem('cart', JSON.stringify(cart));
                    }
                }
                return false;
            };

            function showGoods(data) {
                let out = '';
                for (let i in data) {
                    if (data[i]['show'] == 1) {
                        out += `<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
                        out += `<div class="goods">`;
                        out += `<h5>${data[i]['name']}</h5>`;
                        out += `<img src="${data[i]['image']}" style="width: 60px; height: 60px;" alt="">`;
                        out += `<p class="cost">Цена: ${data[i]['cost']} грн</p>`;
                        out += `<p class="cost">На складе : ${data[i]['kg']} кг</p>`;
                        out += `<p class="cost"><button type="button"  name="add-to-cart"  class="btn btn-success act" data="${data[i]['id']}">Купить</button></p>`;
                        out += `</div>`;
                        out += `</div>`;
                    }
                }
                return out;
            }


            function addToCart(elem) {
                if (cart[elem] !== undefined) {
                    cart[elem]++;
                } else {
                    cart[elem] = 1;
                }
                console.log(cart);
                showCart();
                localStorage.setItem('cart', JSON.stringify(cart));
            }

            function arrayHelper(arr) {
                let out = {};
                for (let i = 0; i < arr.length; i++) {
                    let temp = {};
                    temp['name'] = arr[i]['gsx$name']['$t'];
                    temp['category'] = arr[i]['gsx$category']['$t'];
                    temp['cost'] = arr[i]['gsx$cost']['$t'];
                    temp['image'] = arr[i]['gsx$image']['$t'];
                    temp['show'] = arr[i]['gsx$show']['$t'];
                    temp['kg'] = arr[i]['gsx$kg']['$t'];
                    temp['id'] = arr[i]['gsx$id']['$t'];
                    out[arr[i]['gsx$id']['$t']] = temp;
                }
                return out;
            }

            function showCart() {
                let ul = document.querySelector('.cart');
                ul.innerHTML = '';
                let sum = 0;
                for (let key in cart) {
                    let li = `<li style="list-style-type: none">`;
                    li += goods[key]['name'] + ' ';
                    li += `<img src="${goods[key]['image']}" width="35" height="35">  `;
                    li += ` <button name="minus-goods" data="${key}">-</button> `;
                    li += cart[key] + ' шт ';
                    li += ` <button name="plus-goods" data="${key}">+</button> `;
                    li += goods[key]['cost'] * cart[key];
                    li += ` <button name="delete-goods" data="${key}">x</button>`;
                    li += `</li>`;
                    sum += goods[key]['cost'] * cart[key];
                    ul.innerHTML += li;
                }
                ul.innerHTML += 'Итого: ' + sum;

            }

        } catch (e) {
            console.log(e);
        }
    }
    fa(goods);
});
