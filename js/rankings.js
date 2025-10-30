/*
  Rankings page script
  Displays the leaderboard from localStorage
*/

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  
  // Find the table body where we'll put scores
  const tbody = document.querySelector('#rankings-table tbody');
  if (!tbody) return;

  // Load and display rankings
  function loadRankings() {
    
    // Get all scores from localStorage
    const scores = JSON.parse(localStorage.getItem('breakout_scores') || '[]');
    
    // Find each player's best score
    const topScores = {};
    
    scores.forEach(entry => {
      const username = entry.username;
      
      if (!topScores[username] || entry.score > topScores[username].score) {
        topScores[username] = {
          score: entry.score,
          date: entry.date
        };
      }
    });

    // Convert to array and sort by score
    const rankings = Object.keys(topScores).map(username => ({
      username: username,
      score: topScores[username].score,
      date: topScores[username].date
    }));
    
    rankings.sort((a, b) => b.score - a.score);

    // Check if there are any scores
    if (rankings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem;">No scores yet. Play the game to appear on the leaderboard!</td></tr>';
      return;
    }

    // Clear the table
    tbody.innerHTML = '';

    // Create a row for each player
    rankings.forEach((entry, index) => {
      
      // Format date as DD/MM/YYYY
      let formattedDate = entry.date;
      if (entry.date && entry.date.includes('-')) {
        const [year, month, day] = entry.date.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }
      
      // Create table row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.score}</td>
        <td>${formattedDate}</td>
      `;
      
      tbody.appendChild(tr);
    });
  }

  // Load rankings when page opens
  loadRankings();

  // Handle logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('breakout_currentUser');
      window.location.reload();
    });
  }

  // Update user info in navbar
  const userInfo = document.getElementById('user-info');
  const currentUser = localStorage.getItem('breakout_currentUser');
  
  if (currentUser && userInfo) {
    userInfo.textContent = `Player: ${currentUser}`;
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  }
});
