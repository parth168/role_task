const { http_codes,message,role } = require("./constant");
const jwt = require('jsonwebtoken');
const response = require("./userResponseHandler");

/**
 * @description
 * Check the email is valid or not.
 * @param {string} email 
 */
function validateEmail(email){
    if(email != ''){
        const regExpEmail=/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(!regExpEmail.test(email.trim())){
          return message.invalid_email;
        }
        else{
          return '';
        }
    }
    else{
      return message.invalid_email;
    }
}
  
/**
 * @description
 * Check name is valid or not.
 * @param {string} name 
 */
function validateName(name){
    if(name != ''){
        const regExpName = /^[a-zA-Z]{3,32}$/;
        if(!regExpName.test(name.trim())){  
          return message.invalid_name;
        }
        else{
          return '';
        }
    }
    else{
      return message.invalid_name;
    }
}

/**
 * @description
 * Check Password is valid or not.
 * @param {string} password 
 */
function validatePassword(password){
    if(password != ''){
        const regExpPassword= /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,30}$/;
        if(!regExpPassword.test(password.trim())){
          return message.strong_password;
        }
        else{
          return '';
        }
    }
    else{
      return message.strong_password;
    }
}

/**
 * @description
 * Check user role valid or not.
 * @param {string} reqRole 
 */
function validateReqBodyRole(reqRole){
  if(reqRole.toUpperCase() == role.King || reqRole.toUpperCase() == role.Queen || reqRole.toUpperCase() == role.Male || reqRole.toUpperCase() == role.Female){}
  else{
    return message.wrong_role;
  }

}

/**
 * @description
 * Generate Auth-Token for validation.
 * @param {object} user Contain perticular user details.
 */
function generateAuthToken(user) { 
  return jwt.sign({ _id: user._id, role: user.role}, process.env.jwtPrivateKey,{expiresIn: '24h'});
}

/**
 * @description
 * Check token is valid or not.
 * @param {ovjret} req Request object.
 * @param {object} res Response object.
 */
async function validateToken(req,res){
  const token = req.header('auth_token');

  let decoded = await jwt.verify(token, process.env.jwtPrivateKey, (err,decoded)=>{
    if(err){
      let error = response.middlewareResponse(http_codes.unauthorized,message.invalid_Token);
      res.status(http_codes.unauthorized).send(error);
      return false;
    }
    else{
      return decoded;
    }
  });
  return decoded;
}

/**
 * @description
 * Validate User role and request role to check valid or not.
 * @param {string} req_role 
 * @param {string} valid_role 
 */
function validaterole(req_role,valid_role){
  if(valid_role == role.Male || valid_role == role.Female){
      return false;
  }
  else if(valid_role == role.Queen){
      if(req_role.toUpperCase() == role.Queen || req_role.toUpperCase() == role.King){
          return false;
      }
      else{
          return true;
      }
  }
  else if(valid_role == role.King){
    if(req_role.toUpperCase() == role.King){
        return false;
      }
      else{
          return true;
      }
  }
}

module.exports = {validateEmail,validateName,validatePassword,generateAuthToken,validateToken,validaterole,validateReqBodyRole };