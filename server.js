const express=require('express');
const path=require('path');
const PORT=3005;
const cors=require('cors');
const bodyParser=require('body-parser');
const { default: mongoose } = require('mongoose');
const { type } = require('os');

const app=express()
app.use(cors());
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/mydb')
.then(()=>{
    console.log('MongoDB connected successfully');
})
.catch((err)=>{
    console.log('Error in connecting to MongoDB',err);
})

//schema 

const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        minlength:[2,"Name must be atleast 3 characters"]
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email is already exist']
    },
    phone:Number,
})

const Student=mongoose.model('Student',studentSchema);

app.post('/add-student',async(req,res)=>{
    try{
        const {name,email,phone}=req.body;
        const student=new Student({
            name,
            email,
            phone
        })
        await student.save();
        res.status(201).json({message:"Student added successfully"});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }

})

app.get('/students',async(req,res)=>{
    const students=await Student.find();
    res.status(200).json(students);
})  

app.get('/students/:id',async(req,res)=>{
      try{
            const id=req.params.id
             const student=await Student.findById(id);
             if(!student){
                return res.status(404).json({message:'student not exist'})
             }

             res.status(200).json({student})
      }
      catch(err){
             res.status(500).json({message:'Internal server error'})
      }
})

app.put('/students/:id',async(req,res)=>{
        try{
            const {name,email,phone}=req.body;
            const id=req.params.id
            const student=await Student.findByIdAndUpdate(id,{name,email,phone},{new:true})
            if(!student){
                return res.status(404).json({message:'student not exist'})
            }
            res.status(200).json({message:'student data updated successfully'})

        }
        catch(err){
            res.status(500).json({message:'Internal server error'})
        }
});


app.delete('/students/:id',async(req,res)=>{
     try{
        const id=req.params.id
        const student = await Student.findByIdAndDelete(id);
        if(!student){
            return res.status(404).json({message:'student not exist'})
        }
        res.status(200).json({message:'student data deleted successfully'})
     }
     catch(err){
        res.status(500).json({message:'Internal server error'})

     }
});

app.use((req,res)=>{
  res.status(404).json({message:'page not found..'})
})


// let students=[
//     {id:1,name:'Sona',email:'sona@test.com'},
//     {id:2,name:'Tanisha',email:'tanisha@test.com'},
//     {id:3,name:'Prathvi',email:'p@test.com'},
//     {id:4,name:'Tanu',email:'tanisha@test.com'},
//     {id:5,name:'Tanishka',email:'tanisha@test.com'},
// ];


app.get('/',(req,res)=>{
    res.status(200).json({message:"Welcome in our API"});
})



// app.get('/students',(req,res)=>{
//     res.status(200).json(students);
// })

// app.get('/students/:id',(req,res)=>{
//     const student_id=req.params.id;
//     const student=students.find((st)=>{return st.id===parseInt(student_id)})
//     if(!student){
//         res.status(404).json({message:'Student id not found'})
//     }
//     res.status(200).json(student);
// });

// app.post("/add-student", (req, res) => {
//     const { name, email } = req.body;

//     // Validation check
//     if (!name || !email) {
//         return res.status(400).json({ message: "Name and email are required" });
//     }

//     const newStudent = {
//         id:students.length+1, // More reliable unique ID
//         name,
//         email
//     };

//     students.push(newStudent);
//     res.status(201).json({message:"student added successfully"});
// });


// app.put('/students/:id',(req,res)=>{

//     const id=parseInt(req.params.id)

//     const student=students.find((st)=> st.id===id);
//     if(!student){
//         res.status(404).json({message:'Student id not found'})
//     }

//     const {name,email}=req.body;
//     student.name=name  || student.name;
//     student.email=email || student.email;

//     res.json({message:'student updated successfully'})

// });

// app.delete('/students/:id',(req,res)=>{
     
//     const id=parseInt(req.params.id);

//     students=students.filter(st=>  st.id!==id)
//     res.json({message:'student deleted successfully'})  

// })


app.get('/*',(req,res)=>{
    res.status(404).json({message:"page not found"});
})


app.listen(PORT,()=>{
    console.log(`Server started at port:${PORT}`)
});




// app.get('/',(req,res)=>{
//     //   res.send('Welcome to the express server');
//     res.sendFile(path.join(__dirname,"views","index.html"))
// });

// app.get('/login',(req,res)=>{
//     // res.send('Welcome to the login page');
//     res.sendFile(path.join(__dirname,"views","login.html"))

// });