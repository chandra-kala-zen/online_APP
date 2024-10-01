'use server' ;

import CrudModel from "@/models/crud";
import connect from "@/utils/db";

export default async function CreatCrud(data:{name:string ,age:number}){
    try{
        await connect();
        const Creating = await CrudModel.create({...data});
        console.log("crud created successfully" , Creating);
        return{created:true , data: Creating }
    }
    catch(error){
        console.log("error",error);
        return{created:false ,error : "internal issue"}

    }
}

export async function GetCrud() {
      try {
        await connect();
        const crudData = await CrudModel.find().exec(); // Filter out deleted entries
        console.log("Data retrieved successfully", crudData);
        return { success: true, data: crudData };
      } catch (error) {
        console.error("Error while retrieving data", error);
        return { success: false, error: "Internal error" };
      }
    }