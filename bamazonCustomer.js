const mysql = require('mysql');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});

showItems();

function showItems(){
    connection.connect(function(err){
        if(err) throw err;
        console.log('Connection id: ' + connection.threadId);

        connection.query('SELECT item_id,product_name,price FROM products',function(err,res){
            if(err) throw err;
            console.table(res);
        })

        connection.end();
    })
}



