export async function checkCharacter(token: string, router: any){
    try {
        const res = await fetch("http://localhost:8000/has_character/me", {
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