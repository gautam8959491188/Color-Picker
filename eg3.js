const express=require('express');
const app=express();
const oracle=require('oracledb');
const bodyParser=require('body-parser');
const port=3000;
const urlEncodedBodyParser=bodyParser.urlencoded({extended:false});
app.use(express.static('learn'));
app.get("/",function(request,response){
response.redirect("/index.html");
});
const timePass=(ms)=>{
var promise=new Promise((resolve)=>{
setTimeout(resolve,ms)
});
return promise;
}
class Department
{
constructor(id,name)
{
this.id=id;
this.name=name;
}
getId()
{
return this.id;
}
getName()
{
return this.name;
}
}

class Employee
{
constructor(id,firstName,lastName)
{
this.id=id;
this.firstName=firstName;
this.lastName=lastName;
}
getId()
{
return this.id;
}
getFirstName()
{
return this.firstName;
}
getLastName()
{
return this.lastName;
}
}

class City
{
constructor(id,name)
{
this.id=id;
this.name=name;
}
getId()
{
return this.id;
}
getName()
{
return this.name;
}
}

app.get("/getFirstNames",urlEncodedBodyParser,async function(request,response){
var connection=null;
connection=await oracle.getConnection({
"user" : "hr",
"password" : "hr",
"connectionString" : "localhost:1521/xepdb1"
});
var firstNamePattern=request.query.firstNamePattern;
var resultSet=await connection.execute(`select distinct first_name from employees where lower(first_name) like'${firstNamePattern}%' order by first_name`);
var emps=[];
var i=0;
while(i<resultSet.rows.length)
{
emps.push(resultSet.rows[i][0]);
i++;
}
await connection.close();
response.send(emps);
});


app.get("/getEmployees",async function(request,response){
var connection=null;
connection=await oracle.getConnection({
"username" : "hr",
"password" : "hr",
"connectionString": "localhost:1521/xepdb1"
});
var resultSet=await connection.execute("select employee_id,first_name,last_name from employees order by first_name,last_name");
var emps=[];
var id,firstName,lastName;
var emp;
var i=0;
while(i<resultSet.rows.length)
{
id=resultSet.rows[i][0];
firstName=resultSet.rows[i][1];
lastName=resultSet.rows[i][2];
emp=new Employee(id,firstName,lastName);
emps.push(emp);
i++;
}
await connection.close();
response.send(emps);
});



app.get("/getDepartments",async function(request,response){
var connection=null;
connection=await oracle.getConnection({
"username" : "hr",
"password" : "hr",
"connectionString": "localhost:1521/xepdb1"
});
var resultSet=await connection.execute("select department_id,department_name from departments order by department_name");
var departments=[];
var department;
var id,name;
var i=0;
while(i<resultSet.rows.length)
{
id=resultSet.rows[i][0];
name=resultSet.rows[i][1];
department=new Department(id,name);
departments.push(department);
i++;
}
await connection.close();
response.send(departments);
});


app.get("/getEmployeesByDepartment",urlEncodedBodyParser,async function(request,response){
await timePass(6000);
var connection=null;
connection=await oracle.getConnection({
"user" : "hr",
"password" : "hr",
"connectionString" : "localhost:1521/xepdb1"
});
var departmentId=parseInt(request.query.departmentId);

var resultSet=await connection.execute(`select employee_id,first_name,last_name from employees where department_id=${departmentId} order by first_name,last_name`);
if(resultSet.rows.length==0)
{
await connection.close();
response.sendStatus(404);
return;
}
var employees=[];
var employee,id,firstName,lastName;
var i=0;
while(i<resultSet.rows.length)
{
id=resultSet.rows[i][0];
firstName=resultSet.rows[i][1];
lastName=resultSet.rows[i][2];
employee=new Employee(id,firstName,lastName);
employees.push(employee);
i++;
}
await connection.close();
response.send(employees);
});



app.get("/city",async function(request,response){
console.log("request arrives");
var connection=null;
connection=await oracle.getConnection({
"username" : "hr",
"password" : "hr",
"connectionString": "localhost:1521/xepdb1"
});
var resultSet=await connection.execute("select * from city");
var cities=[];
var id,name;
var city;

var i=0;
while(i<resultSet.rows.length)
{
id=resultSet.rows[i][0];
name=resultSet.rows[i][1];
console.log(id,name);
city=new City(id,name);
cities.push(city);
console.log(cities[i]);
i++;
}
await connection.close();
response.send(cities);
console.log("response sended");
});





app.listen(port,function(err){
if(err)
{
return console.log("Some error");
}
console.log("Server is ready to list on port 3000");
});