const SHEET_NAME = 'Leaderboard';

/**
 * Formate une date en YYYY-mm-dd HH:ii:ss
 */
function formatTimestamp(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const ii = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
}

/**
 * Fonction centrale pour calculer les 3 types de classements
 */
function getLeaderboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Si la feuille est vide (sauf entêtes), on retourne des listes vides
  if (data.length <= 1) {
    return { topScores: [], topGrouped: [], topActive: [] };
  }

  const headers = data.shift(); 

  // 1. Top 10 des scores bruts
  const top10Scores = [...data]
    .sort((a, b) => b[4] - a[4])
    .slice(0, 10);

  // 2. Top 10 des scores groupés par Username (meilleur score par personne)
  const grouped = {};
  data.forEach(row => {
    const user = row[2];
    const score = row[4];
    if (!grouped[user] || score > grouped[user][4]) {
      grouped[user] = row;
    }
  });
  const top10Grouped = Object.values(grouped)
    .sort((a, b) => b[4] - a[4])
    .slice(0, 10);

  // 3. Top 10 des plus actifs (nb de parties)
  const counts = {};
  data.forEach(row => {
    const user = row[2];
    counts[user] = (counts[user] || 0) + 1;
  });
  const top10Active = Object.keys(counts)
    .map(user => ({ username: user, parties: counts[user] }))
    .sort((a, b) => b.parties - a.parties)
    .slice(0, 10);

  return {
    topScores: top10Scores,
    topGrouped: top10Grouped,
    topActive: top10Active
  };
}

/**
 * GET : Retourne l'objet complet des classements
 */
function doGet() {
  const leaderboard = getLeaderboardData();
  return ContentService.createTextOutput(JSON.stringify(leaderboard))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST : Ajoute un score avec timestamp formaté et retourne les classements
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const body = JSON.parse(e.postData.contents);
    
    // Génération du timestamp formaté YYYY-mm-dd HH:ii:ss
    const formattedDate = formatTimestamp(new Date());
    
    // Ajout de la ligne
    sheet.appendRow([
      formattedDate,
      body.fingerprint,
      body.username,
      body.level,
      body.score,
      body.hash
    ]);
    
    const updatedLeaderboard = getLeaderboardData();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      leaderboard: updatedLeaderboard
    }))
    .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}