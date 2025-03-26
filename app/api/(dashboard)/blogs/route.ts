import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user"
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";

export const GET = async (request: Request) => {
    try{
        const { searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryID" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);

        if (!user) {
            JSON.stringify({ massage: "User not found in the database" }), { status: 400 }
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }),
                { status: 400 });
        }

    const filter: any = {
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId),
    };


    // TODO 

    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });

    }catch(error: any){
        return new NextResponse("Error in getting blogs" + error.message, { status: 500 });
    }
}