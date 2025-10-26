const array = document.getElementById("array").textContent;

var parsedJson = JSON.parse(array);

const jsonData = {
    "data": parsedJson
}

function generateTable(data) {
    if(!data || data.length === 0) return 'No data available';

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");

    const keys = Object.keys(data[0]);

    keys.forEach(key => {
        const th = document.createElement("th");

        if(key == 'fullname') {
            th.textContent = 'Nombre Comprador';
        }

        if(key == 'address') {
            th.textContent = 'Dirección';
        }

        if(key == 'comune') {
            th.textContent = 'Comuna';
        }

        if(key == 'region') {
            th.textContent = 'Región';
        }

        if(key == 'country') {
            th.textContent = 'País';
        }

        if(key == 'phone') {
            th.textContent = 'Teléfono';
        }

        if(key == 'mail') {
            th.textContent = 'Email';
        }

        if(key == 'rut') {
            th.textContent = 'RUT';
        }

        if(key == 'sale_order') {
            th.textContent = 'Orden Compra';
        }

        if(key == 'cart') {
            th.textContent = 'Carro';
        }

        if(key == 'subtotal') {
            th.textContent = 'Subtotal';
        }

        if(key == 'shipping') {
            th.textContent = 'Envío';
        }

        if(key == 'total') {
            th.textContent = 'Total';
        }

        if(key == 'sale_date') {
            th.textContent = 'Fecha Venta';
        }

        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement("tr");

        keys.forEach(key => {
            const td = document.createElement("td");
            if(key == 'subtotal') {
                td.textContent = "$" + item[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "";
                
            } else if(key == 'shipping') {
                td.textContent = "$" + item[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "";
                
            } else if(key == 'total') {
                td.textContent = "$" + item[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "";
                
            }else if(key == 'fullname'){
                td.textContent = item[key] || "";
                           
            } else if(key == 'address'){
                td.textContent = item[key] || "";
                 
            } else if(key == 'comune'){
                td.textContent = item[key] || "";
                 
            } else if(key == 'region'){
                td.textContent = item[key] || ""; 
                
            } else if(key == 'country'){
                td.textContent = item[key] || ""; 
                
            } else if(key == 'phone'){
                td.textContent = item[key] || ""; 
                
            } else if(key == 'mail'){
                td.textContent = item[key] || ""; 
                
            } else if(key == 'rut'){
                td.textContent = item[key] || ""; 
                
            } else if(key == 'sale_date'){
                td.textContent = item[key].substring(0, 10) || ""; 
                
            } else if(key == 'cart') {
                const prods = JSON.parse(item[key]);

                for(let i = 0; i < prods.length; i++) {
                    var prod = prods[i];

                    td.textContent = td.textContent + '\n' + prod.nombre + ' x ' + prod.cantidad || "";
                    
                }
            } else if(key == 'sale_order') {
                td.textContent = item[key] || "";
                var input = document.createElement("input");
                input.setAttribute("class", "checkbox");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", item[key]);

                td.append(input);
                
            }
            
            row.appendChild(td);
            
        });
        table.appendChild(row);
        table.style.whiteSpace = 'pre';
    });
    return table;
}

const container = document.getElementById('table-container');
const table = generateTable(jsonData.data);
const td = document.getElementsByTagName('table');
if (table) container.appendChild(table);