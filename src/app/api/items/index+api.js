import { createItem, listGrocery } from "@/lib/server/db-actions";

export async function GET() {
	try {
		const items = await listGrocery();

		return Response.json({ items });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch items";

		return Response.json({ error: message }, { status: 500 });
	}
}

export async function POST(Request) {
	try {
		const body = await Request.json();
		const { name, category, quantity, priority } = body;

		if (!name || !category || !priority) {
			return Response.json(
				{
					error: "Please provide all required fields.",
				},
				{
					status: 400,
				},
			);
		}

        const res = await createItem({ name, category, quantity, priority });

        return Response.json({item} , {status:201})
	} catch (error) {
        const message = error instanceof Error ? error.message : "Failed to Insert items";

		return Response.json({ error: message }, { status: 500 });
    }
}
