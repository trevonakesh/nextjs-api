import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user"

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    }catch(error: any){
        return new NextResponse("Error in fetching user" + error.message, { status: 500 });  
    }
    

};