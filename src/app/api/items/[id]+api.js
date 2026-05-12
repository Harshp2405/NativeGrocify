import { deleteGroceryItem, setGroceryItemPurchased, updateGroceryItemQuantity } from "@/lib/server/db-actions";

export async function PATCH(_req , {id}){
try {
    const body = await _req.json();
		const item = body.quantity
			? await updateGroceryItemQuantity(id, body.quantity)
			: await setGroceryItemPurchased(id, body.purchased ?? true);

		if (!item)
			return Response.json({ error: "Item Not Found" }, { status: 400 });

		return Response.json({ item });

} catch (error) {
    const message =
			error instanceof Error ? error.message : "Failed to Update or create Patch items";

		return Response.json({ error: message }, { status: 500 });
}
}


export async function DELETE(_req , {id}){
    try {
        await deleteGroceryItem(id)
        return Response.json({success:true})
    } catch (error) {
        const message =	error instanceof Error ? error.message : "Failed to delete items";

		return Response.json({ error: message }, { status: 500 });
    }
}