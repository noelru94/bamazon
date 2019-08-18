const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    port: 3306,
    user: 'root',
    password: 'Spring126',
    database: 'bamazon'
});


connection.connect((err)=>{
ManagerPortal();
    function ManagerPortal(){
   
       
        if(err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'Username',
                name: 'username',
            },
            {
                type:'password',
                message: 'Enter Password',
                name: 'password',
                mask: '*'
            }
        ]).then((answer)=>{
            connection.query('SELECT password FROM managerLogins WHERE username=?',[answer.username],(err,data)=>{

                if(answer.password === data[0].password){
                    portal();  
                }else{
                    console.log('Wrong username or password');
                    ManagerPortal();
                }
            })
                
        })
    
    }
});

let portal = ()=>{

        inquirer.prompt([
            {
                type: 'list',
                message: 'Menu Options',
                choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','Exit Portal'],
                name: 'manager'
            }
        ]).then((answer)=>{

            switch(answer.manager){
                case 'View Products for Sale':
                viewProducts();
                break;

                case 'View Low Inventory':
                viewLowInventory();
                break;

                case 'Add to Inventory':
                addToInventory();
                break;

                case 'Add New Product':
                addNewProduct();
                break;

                case 'Exit Portal':
                exitPortal();
                break;
            }
        })  
}

let exitPortal = () =>{
    connection.end();
}


let viewProducts = ()=> {
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;
        
        console.table(data);
        viewOptions();
    })
}

let viewLowInventory = ()=> {
    connection.query('SELECT item_id,product_name,price,stock_quantity From products WHERE stock_quantity < ?',['5'],(err,data)=>{
        if(err) throw err;

        console.table(data);
        viewOptions();
    })
}

let addToInventory = ()=> {
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;
        console.table(data);
    
        inquirer.prompt([
            {
                type: 'number',
                message:'Which product would you like to add inventory too?',
                name: 'itemId'
            },
            {
                type: 'number',
                message: 'Add quantity to inventory',
                name: 'quantity'
            }
        ]).then((answer)=>{
        
            var newInventoryTotal = data[answer.itemId-1].stock_quantity + answer.quantity;

            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[newInventoryTotal,answer.itemId],(err,data)=>{
                if(err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: ['Continue adding more to inventory','Main Menu','Exit Portal'],
                        name : 'options'
                    }
                ]).then((answer)=>{
                    if(answer.options === 'Continue adding more to inventory'){
                        addToInventory();
                    }else if(answer.options === 'Main Menu'){
                        portal();
                    }else{
                        exitPortal();
                    }
                })
            })
        })
    });
}

let addNewProduct = ()=> {
    connection.query('SELECT item_id,product_name,price,stock_quantity From products',(err,data)=>{
        if(err) throw err;
        console.table(data);

        inquirer.prompt([
            {
                input: 'number',
                message: 'input ID number',
                name: 'item_id'
            },
            {
                message: 'Name of item',
                name:'product_name'
            },
            {
                message: 'Department name',
                name: 'department'
            },
            {
                input: 'number',
                message: 'Price of item',
                name: 'price'
            },
            {
                input: 'number',
                message: 'Stock quantity',
                name:'stock_quantity'
            }
        ]).then((answer)=>{
            connection.query('INSERT INTO products(item_id,product_name,department_name,price,stock_quantity)Values(?,?,?,?,?)',
            [answer.item_id,answer.product_name,answer.department,answer.price,answer.stock_quantity],(err)=>{
                if(err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: ['Continue adding more products to inventory','Main Menu','Exit Portal'],
                        name : 'options'
                    }
                ]).then((answer)=>{
                    if(answer.options === 'Continue adding more products to inventory'){
                        addNewProduct();
                    }else if(answer.options === 'Main Menu'){
                        portal();
                    }else{
                        exitPortal();
                    }
                })
            })
        })
    })
};

let viewOptions = ()=>{
    inquirer.prompt([
        {
            type: 'list',
            choices: ['Main Menu','Exit Portal'],
            name: 'options'
        }
    ]).then((answer)=>{
            if(answer.options === 'Main Menu'){
                portal();
            }
            else{
                exitPortal();
            }
    });
};
