import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user"
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";


export const GET = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryID" }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogId" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }),
                { status: 400 });
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        });

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "blog not found" }),
                { status: 400 });
        }

        return new NextResponse(JSON.stringify({ blog }), { status: 200 });


    } catch (error: any) {
        return new NextResponse("Error in getting blog" + error.message, { status: 500 });
    }
}


export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;

    try {
        const body = await request.json();
        const { title, description } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogId" }),
                { status: 400 }
            );
        }

        await connect();


        const user = await User.findById(userId);

        if (!user) {
            JSON.stringify({ massage: "User not found in the database" }), { status: 400 }
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
        });

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "blog not found" }),
                { status: 400 });
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return new NextResponse(JSON.stringify({ message: "blog updated", blog: updateBlog }),
            { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in updating blog" + error.message, { status: 500 });
    }
}


export const DELETE = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
try{
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
            JSON.stringify({ message: "Invalid or missing userId" }),
            { status: 400 }
        );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return new NextResponse(
            JSON.stringify({ message: "Invalid or missing blogId" }),
            { status: 400 }
        );
    }

    await connect();

    const user = await User.findById(userId);

        if (!user) {
            JSON.stringify({ massage: "User not found in the database" }), { status: 400 }
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
        });

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "blog not found" }),
                { status: 400 });
        }

        await Blog.findByIdAndDelete(blogId);

        return new NextResponse(JSON.stringify({ message: "blog deleted" }),
            { status: 200 });

}catch(error: any){
    return new NextResponse("Error in deleting blog" + error.message, { status: 500 });
}


}