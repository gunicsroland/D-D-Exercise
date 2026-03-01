import { API_URL } from "../constants";

export async function consumeItem(token:string, item_id: number) {
    try {
        const res = await fetch(`${API_URL}/inventory/${item_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });


    } catch{
        return;
    }
}