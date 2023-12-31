module.exports = async function (context, request) {

    const pg = require('pg');

    const config = {
        host: process.env["POSTGRES_SERVER"],
        user: process.env["POSTGRES_USER"],
        password: process.env["POSTGRES_USER_PASSWORD"],
        database: process.env["POSTGRES_DATABASE"],
        port: 5432,       
    };   

     // get the query parameter from the URL
    
    //const customer_id = request.query.customer_id;
    const city = request.query.city;
    const country = request.query.country;       

    // Create query to execute against the database
    const text = `SELECT company_name, contact_name, address, city, country FROM customers WHERE city =(${city}) and country = (${country})`;   
    //console.log(customer_id)
    const querySpec = {
        text: text,        
    }

    try {
        // Create a pool of connections
        const pool = new pg.Pool(config);
        

        // Get a new client connection from the pool
        const client = await pool.connect();
        console.log("connection successful");

        // Execute the query against the client
        const result = await client.query(querySpec);

        // Release the connection
        client.release();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 200,
            isRaw: true,
            body: result.rows,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(err.message);
    }    
}



