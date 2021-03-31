async function fa() {
    const urlGoogleSheet = "https://spreadsheets.google.com/feeds/list/16V959DYUkqz3ZWiD3AbbDAzuA00qUCnOV52TsHyzcOI/od6/public/values?alt=json";
    try{
        let response = await fetch(urlGoogleSheet);
        let data = await response.json();
        console.log(data);
        data = data["feed"]["entry"];
        console.log(data);

        showGoods(data);
    } catch (e) {
        console.log(e);
    }


}

fa();

function showGoods(data) {
    let out = '';
    for (let i = 0; i < data.length; i++) {
        if(data[i]['gsx$show']['$t'] == 1) {
            out += `<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
            out += `<div class="goods">`;
            out += `<h5>${data[i]['gsx$name']['$t']}</h5>`;
            out += `<img src="${data[i]['gsx$image']['$t']}" style="width: 60px; height: 60px;" alt="">`;
            out += `<p class="cost">Цена: ${data[i]['gsx$cost']['$t']} грн</p>`;
            out += `<p class="cost">На складе : ${data[i]['gsx$kg']['$t']} кг</p>`;
            out += `</div>`;
            out += `</div>`;
        }
    }
    document.querySelector(".shop-field").innerHTML = out;
}
