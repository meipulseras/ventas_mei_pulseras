import connectionToDB from "./connection.js";

async function updatePaidSales(saleOrder) {
    
    const query = `UPDATE sales SET paid = true WHERE paid = false AND ready_to_dispatch = false AND sale_order = '${saleOrder}'`;
    const result = await connectionToDB().query(query);
    return result;
};
        
export default updatePaidSales;