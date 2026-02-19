import { prisma } from "@/lib/prisma";
import { type RouteContext } from "next";
import { NextRequest } from "next/server";

// PUT /api/todos/:id
export const PUT = async (
    req: NextRequest,
    { params }: RouteContext<"/api/todos/[id]">,
) => {
    const { id } = await params;

    const body = await req.json();

    const todo = await prisma.todo.update({
        where: { todo_id: Number(id) },
        data: {
            description: body.description,
            completed: body.completed,
        },
    });

    return Response.json(todo);
};

// DELETE /api/todo/:id
export const DELETE = async (
    _req: NextRequest,
    { params }: RouteContext<"/api/todos/[id]">,
) => {
    const { id } = await params;

    await prisma.todo.delete({
        where: { todo_id: Number(id) },
    });

    return new Response(null, { status: 204 });
};
