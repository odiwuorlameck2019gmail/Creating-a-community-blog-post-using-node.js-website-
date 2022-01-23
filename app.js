const express=require('express')


const app=express()
//connect to mongodb.
const dbURI='mongodb+srv://lameck:tangimeko7583@communitydb.isb85.mongodb.net/node-tuts?retryWrites=true&w=majority';
const morgan=require('morgan');
const mongoose=require('mongoose');
const Blog=require('./models/Blog');

mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>app.listen(3000,'localhost',()=>{
    console.log('Server Listening on port 5000----')
}))
.catch((err)=>console.log(err));

//register view engine .
app.set('view engine','ejs');
//app.set('views','')

//listening to port requests .


//middleware and static files .
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use((req,res,next)=>{
console.log('new request  made :');
console.log('host:',req.hostname);
console.log('path:',req.path);
console.log('method:',req.method);
next();
});

app.use((req,res,next)=>{
    console.log('In the next middleware');
    next();
    });



app.get('/',(req,res)=>{
    res.redirect('/blogs');
    });
app.get('/blogs',(req,res)=>{
Blog.find().sort({createdAt:-1})
.then((results)=>{
res.render("index",{title:'All Blogs',blogs:results});
})
.catch((err)=>{
console.log(err);
})


});

app.post('/blogs',(req,res)=>{
const blog=new Blog(req.body);
blog.save()
.then((results)=>{
res.redirect('/blogs')
})
.catch((err)=>{
    console.log(err)
}
)});


app.get('/about',(req,res)=>{
        res.render('about',{title:'About'});
    });

app.get('/about-us',(req,res)=>{
res.redirect('/about');
});



app.get('/blogs/create',(req,res)=>{
    res.render('create',{title:'Create Blogs'});
});


app.get('/blogs/:id',(req,res)=>{
    const id =req.params.id;
    Blog.findById(id)
    .then(results=>{
        res.render('details',{detailed_blog:results,title:'Blog Details'})
    
    })
    .catch((err)=>{
        console.log(err);
    });
    
    });

    app.delete('/blogs/:id',(req,res)=>{
        const id=req.params.id;
        console.log("Deleted now:")
        console.log(id);
        Blog.findByIdAndDelete(id)
        .then((result)=>{
         res.json({redirect:'/blogs'});
       })
         .catch((err)=>{
             console.log(err);         
         });
        
       });

    



app.use((req,res)=>{
    res.status(404).render('404',{title:'Error 404'});
});


    



