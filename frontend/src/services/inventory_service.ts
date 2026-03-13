import { API_URL } from "../constants";

export async function consumeItem(token:string, item_id: number) {
    try {
        const res = await fetch(`${API_URL}/inventory/consume/${item_id}`, {
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

export async function getInventory(token:string) {
      const res = await fetch(`${API_URL}/inventory/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch character");
  }

  return res.json();
}