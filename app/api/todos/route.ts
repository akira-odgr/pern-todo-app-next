import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// POST /api/todos
export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const todo = await prisma.todo.create({
        data: {
            description: body.description,
        },
    });

    return Response.json(todo, { status: 201 });
};

// GET /api/todos
export const GET = async () => {
    const todos = await prisma.todo.findMany({
        orderBy: {
            todo_id: "asc",
        },
    });

    return Response.json(todos);
};
