const config = require("config");

module.exports = ()=>{
    //  Ensure that jwt privatekey is present
    if(!config.get("blog_jwtPrivateKey")){
        throw new Error("Fatal Error: jwtPrivateKey Not found");
    }
}