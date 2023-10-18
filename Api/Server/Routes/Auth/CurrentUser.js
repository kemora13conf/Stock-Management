class CurrentUser{
    constructor(user){
        for(let key of Object.keys(user.toObject())){
            if(key == 'password' || key == 'salt') continue;
            this[key] = user[key]
        }
        this._id = user._id;
    }

    
}

export default CurrentUser;