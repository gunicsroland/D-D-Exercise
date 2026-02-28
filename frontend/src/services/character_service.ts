import { API_URL } from "../constants";

export async function createChar(name: string, selectedClass: string, finalStats: any, id: number, token: string) {
    const res = await fetch(`${API_URL}/character/${id}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, class_: selectedClass, abilities: finalStats }),
    });

    return res;
}

export async function checkCharacter(token: string, id : number){
    try {
        const res = await fetch(`${API_URL}/character/has_character/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.has_character) {
            return true;
          }
          else {
            return false;
          }
        }
      }
      catch (err) {
        console.error(err);
      }
}