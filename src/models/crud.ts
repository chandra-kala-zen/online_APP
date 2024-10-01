import mongoose,{Document,Schema,Model} from "mongoose";

interface Crud extends Document
{
    name :string ;
    age :number ;
    gender: string;
}
const CrudSchema : Schema<Crud> = new Schema({
    name:{type:String , required:true},
    age:{type:Number ,required:true},
    gender:{type:String , required:true},
})

const CrudModel : Model<Crud> = mongoose.models.Crud || mongoose.model<Crud> ("CrudActions" , CrudSchema);
export default CrudModel;