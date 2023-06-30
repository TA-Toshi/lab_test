'use strict';


document.addEventListener( "DOMContentLoaded", get_json_data, false );

let data
let custom_data
let state = {
    'page': 1,
    'rows': 5,
}

let clean = document.getElementsByClassName('cleaner')[0];
let search_text = document.getElementsByName('username')[0];
let table = document.getElementById('table_body');
let date_sorting = document.getElementsByClassName('date_sort')[0];
let rating_sort = document.getElementsByClassName('rating_sort')[0];
let pages_container = document.getElementsByClassName('pages')[0];
let popup = document.getElementsByClassName('popup')[0];
let popup_btn_n = document.getElementsByClassName('popup_btn_n')[0];
let popup_btn_y = document.getElementsByClassName('popup_btn_y')[0];
let del_id;

search_text.addEventListener('input', function(){
        let value = search_text.value
        clean.style.visibility = 'visible'
        let search_data = search_table(value, data)
        append_json(search_data)
        if (value != '') {
            let search_data = search_table(value, custom_data)
            data = search_data
            append_json(search_data)
        }
        else{
            clean.style.visibility = 'hidden'
            data = custom_data
            append_json(data)
        }
      
})


function search_table(value, data){
    let fitered_data = []
    data.forEach(function(object){
        value = value.toLowerCase()
        let name = object.username.toLowerCase()
        let email = object.email.toLowerCase()
        if(name.includes(value) || email.includes(value)){
            fitered_data.push(object)
        }
    })

    return fitered_data
}


date_sorting.addEventListener('click', function () {
    let line_rating = rating_sort.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    let line_date = this.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    let ds = this.dataset.order
    clean.style.visibility = 'visible'
    let data_sort
    if (ds == 'down') {

        this.style.color = '#333';
        line_date.style.stroke = '#333';

        rating_sort.style.color = '#9EAAB4';
        line_rating.style.stroke = '#9EAAB4';


        this.dataset.order = 'up'
        data_sort = data.sort((a,b) => a.registration_date < b.registration_date ? 1:-1)
    } else {
           
        this.style.color = '#333';
        line_date.style.stroke = '#333';

        rating_sort.style.color = '#9EAAB4';
        line_rating.style.stroke = '#9EAAB4';


        this.dataset.order = 'down'
        data_sort = data.sort((a,b) => a.registration_date > b.registration_date ? 1:-1)
    }
    append_json(data_sort)
 });

 rating_sort.addEventListener('click', function () {
    let line_rating = this.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    let line_date = date_sorting.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    let ds = this.dataset.order
    clean.style.visibility = 'visible'
    let data_sort
    if (ds == 'down') {

        this.style.color = '#333';
        line_rating.style.stroke = '#333';

        date_sorting.style.color = '#9EAAB4';
        line_date.style.stroke = '#9EAAB4';

        this.dataset.order = 'up'
        data_sort = data.sort((a,b) => a.rating > b.rating ? 1:-1)
    } else {
        
        this.style.color = '#333';
        line_rating.style.stroke = '#333';

        date_sorting.style.color = '#9EAAB4';
        line_date.style.stroke = '#9EAAB4';


        this.dataset.order = 'down'
        data_sort = data.sort((a,b) => a.rating < b.rating ? 1:-1)
    }
    append_json(data_sort)
 });

function get_json_data(){
    let json_url = 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users';

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {

            data = JSON.parse(this.responseText);
            custom_data = JSON.parse(this.responseText);
            append_json(data);
            
        }
    }
    xmlhttp.open('GET', json_url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send();

}


clean.addEventListener('click', function() {
    
    data = custom_data.sort((a,b) => Number(a.id) > Number(b.id) ? 1:-1)
    append_json(data)
    
    let line_rating = rating_sort.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    let line_date = date_sorting.getElementsByTagName('svg')[0].getElementsByTagName('path')[0]
    
    date_sorting.style.color = '#9EAAB4';
    line_date.style.stroke = '#9EAAB4';
    
    rating_sort.style.color = '#9EAAB4';
    line_rating.style.stroke = '#9EAAB4';

    search_text.value = ''
    this.style.visibility = 'hidden'

    
})


function pagination(data, page, rows) {
    let start = (page - 1) * rows

    let end = start + rows

    let tail_data = data.slice(start, end)

    let pages = Math.ceil(data.length/rows)
    return{
        'data': tail_data,
        'pages': pages
    }
}

function pages_buttons(pages) {
    
    pages_container.innerHTML = ''

    for (let page = 1; page <= pages; page ++) {
        
        pages_container.innerHTML += `<button value=${page} class ='page'>${page}</button>`

    }


    let buttons = pages_container.children.length
    for (var i = 0; i < buttons ; i++) {

        let page = document.getElementsByClassName('page')[i]
        page.addEventListener("click", function() {

            table.innerHTML = ''
            state.page = Number(page.value)
            
            append_json(data)
    });
}}


table.addEventListener('click', function(e) {

    if(e.target && e.target.matches("button") || e.target.matches("svg")) {
        if (e.target.matches("svg")) {          
            del_id = Number(e.target.parentNode.attributes.value.value)
        } else {
            del_id = Number(e.target.attributes.value.value)
        }
        popup.style.visibility = 'visible'
    }
})

popup_btn_y.addEventListener('click',function(){
    popup.style.visibility = 'hidden'

    data = data.filter(function(jsonObject) {
        return jsonObject.id != del_id;
    });
    custom_data = data
    append_json(data)
})

popup_btn_n.addEventListener('click',function(){
    popup.style.visibility = 'hidden'
})

function append_json(data){
    
        table.innerHTML = ''
    let inform = pagination(data, state.page, state.rows)
    inform.data.forEach(function(object) {
        let tr = document.createElement('tr');
        let d = new Date(object.registration_date);
        let formatted = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        tr.innerHTML = '<td class="username">' + object.username + '</td>' +
        '<td>' + object.email + '</td>' +
        '<td>' + formatted + '</td>' +
        '<td>' + object.rating + '</td>'+
        `<td>
            <button class="delete" value="${object.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L20 20" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M4 20L20 4" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </td>`;
        table.appendChild(tr);
        
    });
    pages_buttons(inform.pages);
}
