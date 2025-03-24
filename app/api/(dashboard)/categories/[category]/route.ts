import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user"
import { Types } from "mongoose";
import Category from "@/lib/models/category";

export const PATCH = async (request: Request, context: { param: any }) => {
    const categoryId = context.params.category;
    try {
        const body = await request.json();
        const { title } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            JSON.stringify({ massage: "User not found in the database" }), { status: 400 }
        }

        const category = await Category.findOne({ _id: categoryId, userId });

        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }),
                { status: 400 });
        }

        const updateCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        return new NextResponse(JSON.stringify({ message: "category updated", category: updateCategory }),
            { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in updating category" + error.message, { status: 500 });
    }
}