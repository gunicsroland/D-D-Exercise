import { API_URL } from "../constants";
import { CharacterUpdatePayload } from "../types/types";

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

export async function checkCharacter(token: string){
    try {
        const res = await fetch(`${API_URL}/character/has_character/0`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

export async function getCharacter(token: string) {
  const res = await fetch(`${API_URL}/character/me`, {
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

export async function lvlUpAbility(token: string, ability:string) {
  const res = await fetch(`${API_URL}/character/upgrade_ability?ability=${ability}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Upgrade failed");
  }

  return res.json();
}

export async function updateCharacter(token:string, updateData: CharacterUpdatePayload) {
  try {
    const res = await fetch(`${API_URL}/character/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if(!res.ok){
      throw new Error("Nem sikerült a név módosítás");
    }

    return res;

  } catch (err: any){
    return err.message;
  }
}