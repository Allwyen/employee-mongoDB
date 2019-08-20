const Express = require("express");
const Mongoose = require('mongoose');

var request = require('request');
var bodyParser = require('body-parser');

var app = new Express();

app.set('view engine','ejs'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

Mongoose.connect("mongodb://localhost:27017/employeedb");

const EmployeeModel= Mongoose.model("employeedetail",{
    ename:String,
    edesign:String,
    esalary:String
});

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/addemployee',(req,res)=>{
    res.render('addemployee');
}); 

app.post('/read',(req,res)=>{
    //var items=req.body;
    //res.render('read',{item:items});

    var employee = new EmployeeModel(req.body);
    var result = employee.save((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send("<script>alert('Employee Successfully Inserted')</script>");
        }
    });

});

app.get('/employeeall',(req,res)=>{

    var result = EmployeeModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

const APIurl = "http://localhost:3456/employeeall";

app.get('/viewemployee',(req,res)=>{

    request(APIurl,(error,response,body)=>{
        var data = JSON.parse(body);
        res.render('viewemployee',{data:data});
    });
});

app.get('/searchemployee',(req,res)=>{
    res.render('searchemployee');
});

app.get('/employeename',(req,res)=>{
    var item = req.query.ename;
    //console.log(item);
    var result = EmployeeModel.find({ename:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    })

});

const APIurl2 = "http://localhost:3456/employeename";

app.post('/viewsingleemployee',(req,res)=>{

    var item = req.body.ename;

    request(APIurl2+"/?ename="+item,(error,response,body)=>{
        var data = JSON.parse(body);
        res.render('viewsingle',{data:data});
    })
});

app.listen(process.env.PORT || 3456,()=>{
    console.log("Server running on port::3456...");
});  //we can assign any number.3000 is commonly used.