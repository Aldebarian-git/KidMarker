const users = {
  Arwen: { points: 0, rewards: [] },
  Ewena: { points: 0, rewards: [] },
};

const rewardsCatalog = [
  { name: "Sortie au cinéma 🎥🍿🎬 ", cost: 20 },
  { name: "Une pièce de 1 euros 🪙", cost: 10 },
  { name: "Mac-Donald 🍔 🍟 🥤", cost: 10 },
  { name: "Un bonbon 🍬", cost: 2 },
  { name: "Un jouet de mon choix 🎮", cost: 50 },
];

// Rendre les utilisateurs sur la page
function renderUsers() {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "";
  for (const [name, data] of Object.entries(users)) {
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerHTML = `
        <h3>${name}</h3>
        <p>Points: ${data.points}</p>
        <div class="actions">
          <button onclick="addPoints('${name}', 1)">+1 Points</button>
          <button onclick="addPoints('${name}', -1)">-1 Points</button>
        </div>
        <p>Récompenses: ${data.rewards.join(", ") || "Aucune"}</p>
      `;
    usersDiv.appendChild(userDiv);
  }
}

// Rendre le catalogue de récompenses sur la page
function renderRewards() {
  const rewardsDiv = document.getElementById("rewards");
  rewardsDiv.innerHTML = "";
  rewardsCatalog.forEach((reward) => {
    const rewardDiv = document.createElement("div");
    rewardDiv.innerHTML = `
        <p>${reward.name} - ${reward.cost} Points</p>
        <button onclick="redeemReward('${reward.name}', ${reward.cost})">Échanger</button>
      `;
    rewardsDiv.appendChild(rewardDiv);
  });
}

// Ajouter ou retirer des points pour un utilisateur
function addPoints(username, points) {
  if (users[username]) {
    users[username].points += points;
    saveData(); // Sauvegarder les données après modification
    renderUsers();
  } else {
    alert("Utilisateur introuvable !");
  }
}

// Échanger une récompense contre des points
function redeemReward(rewardName, rewardCost) {
  const username = prompt(
    "Entrez le nom de l'utilisateur qui échange la récompense :"
  );
  if (users[username] && users[username].points >= rewardCost) {
    users[username].points -= rewardCost;
    users[username].rewards.push(rewardName);
    saveData(); // Sauvegarder les données après modification
    renderUsers();
  } else {
    alert("Points insuffisants ou utilisateur introuvable.");
  }
}

// Charger les données depuis le serveur
async function loadData() {
  try {
    const response = await fetch("http://localhost:3000/data");
    const data = await response.json();
    Object.assign(users, data); // Charger les données dans `users`
    renderUsers();
    renderRewards();
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

// Sauvegarder les données sur le serveur
async function saveData() {
  try {
    await fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });
    console.log("Données sauvegardées !");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données :", error);
  }
}

// Charger les données et initialiser la page au chargement
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});
