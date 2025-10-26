import connectionToDB from "./connection.js";

async function getPaidSalesFromTable() {
    const query = `SELECT sale_order, fullname, address, comune, region, country, phone, mail, rut, cart, subtotal, shipping, total, sale_date FROM user_info INNER JOIN sales ON user_info.username = sales.username WHERE sales.paid = true AND ready_to_dispatch = false ORDER BY sale_date ASC`;
    const result = await connectionToDB().query(query);
    return result;
};
        
export default getPaidSalesFromTable;