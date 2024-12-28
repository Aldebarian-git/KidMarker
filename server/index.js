const rewardsCatalog = [
  { name: "Sortie au cinéma 🎥🍿🎬 ", cost: 20 },
  { name: "Une pièce de 1 euros 🪙", cost: 10 },
  { name: "Mac-Donald 🍔 🍟 🥤", cost: 10 },
  { name: "Un bonbon 🍬", cost: 2 },
  { name: "Un jouet de mon choix 🎮", cost: 50 },
];

function renderUsers() {
  fetch("/api/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      return response.json();
    })
    .then((users) => {
      const usersDiv = document.getElementById("users");
      usersDiv.innerHTML = ""; // Réinitialiser le contenu
      for (const [name, data] of Object.entries(users)) {
        const userDiv = document.createElement("div");
        userDiv.className = "user";
        userDiv.innerHTML = `
          <h3>${name}</h3>
          <p>Points : ${data.points}</p>
          <div class="actions">
            <button onclick="addPoints('${name}', 1)">+1 Point</button>
            <button onclick="addPoints('${name}', -1)">-1 Point</button>
          </div>
          <p>Récompenses : ${data.rewards.join(", ") || "Aucune"}</p>
        `;
        usersDiv.appendChild(userDiv);
      }
    })
    .catch((error) =>
      console.error("Erreur lors du rendu des utilisateurs :", error)
    );
}

// Rendre le catalogue de récompenses sur la page
function renderRewards() {
  const rewardsDiv = document.getElementById("rewards");
  rewardsDiv.innerHTML = "";
  rewardsCatalog.forEach((reward) => {
    const rewardDiv = document.createElement("div");
    rewardDiv.className = "reward";
    rewardDiv.innerHTML = `
      <p>${reward.name} - ${reward.cost} Points</p>
      <button onclick="redeemReward('${reward.name}', ${reward.cost})">Échanger</button>
    `;
    rewardsDiv.appendChild(rewardDiv);
  });
}

function addPoints(username, points) {
  fetch(`/api/users/${username}/points`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Échec de la mise à jour des points");
      }
      return response.json();
    })
    .then(() => renderUsers()) // Recharge les utilisateurs après mise à jour
    .catch((error) =>
      console.error("Erreur lors de l'ajout de points :", error)
    );
}

// Échanger une récompense contre des points
function redeemReward(rewardName, rewardCost) {
  const username = prompt(
    "Entrez le nom de l'utilisateur qui échange la récompense :"
  );
  if (!username) {
    alert("Nom d'utilisateur requis !");
    return;
  }

  fetch(`/api/users/${username}/rewards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reward: rewardName, cost: rewardCost }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then(() => renderUsers())
    .catch((error) => alert(`Erreur : ${error.message}`));
}

// Initialiser la page
document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  renderRewards();
});
