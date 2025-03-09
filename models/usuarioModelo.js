import mongoose, { mongo } from "mongoose";

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        trim : true,
        username : true
    },
    email:{
        type: String,
        required:true,
        trim : true,
        unique : true
    },
    password: {
        type: String,
        required : true
    },
    salt: {
        type: String,
        required:true
    }
},
{
    timestamps: true
}
);

export default mongoose.model('User', usuarioSchema);