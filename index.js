const express = require('express'),
bodyParser = require('body-parser'),
morgan      = require('morgan'),
jwt    = require('jsonwebtoken'),
config = require('./configurations/config'),
cors = require('cors'),
app = express(); 


//set secret
app.set('Secret', config.secret);

// cors 
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

// use morgan to log requests to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
const  ProtectedRoutes = express.Router(); 
app.use('/api', ProtectedRoutes);
ProtectedRoutes.use((req, res, next) =>{

     
    // check header or url parameters or post parameters for token
    var token = req.headers['access-token'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
     
          message: 'No token provided.' 
      });
  
    }
  });

app.listen(3000,()=>{

 console.log('server is running on port 3000') 

});
app.get('/', function(req, res) {
    res.send('Hello world  ! app is running on http://localhost:3000/');
});
app.post('/authenticate',(req,res)=>{

    if(req.body.username==="aymen"){

        if(req.body.password==="123"){
             //if eveything is okey let's create our token 
         
        const payload = {

            check:  true
  
          };

          var token = jwt.sign(payload, app.get('Secret'), {
            expiresIn: 1440 // expires in 24 hours
          });
  
          // return the informations to the client
          res.json({
            message: 'authentication done ',
            token: token
          });
       
        }else{
            res.json({message:"please check your password !"})
        }

    }else{
       
        res.json({message:"user not found !"})

    }

})
ProtectedRoutes.get('/getAllProducts',(req,res)=>{
 let products = [
     {
         id: 1,
         name:"cheese"
     },
     {
        id: 2,
        name:"carottes"
    }
 ]

 res.json(products)


})