// 'use client'

 
// import { Button } from "@/components/ui/button";
// import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import CreatCrud from "@/lib/crudActions";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { FormProvider, useForm } from "react-hook-form"
// import { z } from "zod"
 
// interface CrudForm
// {
//     name : string ;
//     age : number;
// }
// const formSchema = z.object({
//     name: z.string().min(1, "Name is required").max(50, "Name is too long"),
//     age: z
//         .number()
//         .min(1, "Age must be greater than 0")
//         .max(120, "Age must be less than or equal to 120"),
//   })

// function CrudPage(){


// const methods = useForm<CrudForm >({
//     resolver:zodResolver(formSchema),
//     mode: "onChange",
//     reValidateMode: "onChange",
//     shouldFocusError: true,
//   });
  
  
//     const {
//       register,
//       handleSubmit,
//       reset,
//       formState: { errors },
//     } = methods
//     const onSubmit = async(data : CrudForm) =>{
//         const res = await CreatCrud(data);
//         if(res.created){
//             reset();
//             console.log("crud created successfully");
//         }else{
//             console.log("errors")
//         }

//     }
//     return(
//         <div>
//             <h1>Hello</h1>
//         <FormProvider {...methods}>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
//                     <FormItem>
//                     <FormLabel>Username</FormLabel>
//                     <FormControl>
//                         <Input placeholder="Enter your name" {...register("name")} />
//                     </FormControl>
//                     <FormDescription>
//                         This is your public display name.
//                     </FormDescription>
                  
//                     {errors.name && <FormMessage >{errors.name.message} </FormMessage >}
//                     </FormItem>


//                     <FormItem>
//                     <FormLabel>UserAge</FormLabel>
//                     <FormControl>
//                         <Input placeholder="Enter your age"  {...register("age" ,{valueAsNumber:true})} />
//                     </FormControl>
//                     <FormDescription>
//                         This is your public display age.
//                     </FormDescription>
//                     {errors.age && <FormMessage >{errors.age.message} </FormMessage >}
//                     </FormItem>
               
//                 <Button type="submit">Submit</Button>
//             </form>
//             </FormProvider>

//         </div>
//     )
// }
// export default CrudPage

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CreatCrud from "@/lib/crudActions"; // assuming CreatCrud creates a new record
import { GetCrud } from "@/lib/crudActions"; // assuming GetCrud fetches records
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface CrudForm {
  name: string;
  age: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  age: z
    .number()
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than or equal to 120"),
});

function CrudPage() {
  const [crudData, setCrudData] = useState<CrudForm[]>([]); // State to store fetched data
  const [loading, setLoading] = useState<boolean>(true); // Loading state for data fetching
  const methods = useForm<CrudForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: CrudForm) => {
    const res = await CreatCrud(data);
    if (res.created) {
      reset();
      console.log("Crud created successfully");
      fetchData(); // Fetch the latest data after creation
    } else {
      console.log("Errors occurred");
    }
  };

  // Function to fetch data from MongoDB
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await GetCrud();
      if (result.success) {
        setCrudData(result.data);
      } else {
        console.error("Failed to retrieve data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>CRUD Operations</h1>
      
      {/* Form for creating new CRUD entries */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Enter your name" {...register("name")} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>User Age</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your age"
                {...register("age", { valueAsNumber: true })}
              />
            </FormControl>
            <FormDescription>This is your public display age.</FormDescription>
            {errors.age && <FormMessage>{errors.age.message}</FormMessage>}
          </FormItem>

          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>

      {/* Display retrieved data */}
      <div className="mt-8">
        <h2>Retrieved Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : crudData.length > 0 ? (
          <ul>
            {crudData.map((item, index) => (
              <li key={index}>
                <strong>Name:</strong> {item.name}, <strong>Age:</strong> {item.age}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data found</p>
        )}
      </div>
    </div>
  );
}

export default CrudPage;
