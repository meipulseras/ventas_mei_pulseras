import connectionToDB from "./connection.js";

async function updateTableSales(saleOrder) {
    
    const query = `UPDATE sales SET ready_to_dispatch = true WHERE ready_to_dispatch = false AND sale_order = '${saleOrder}'`;
    const result = await connectionToDB().query(query);
    return result;
};
        
export default updateTableSales;