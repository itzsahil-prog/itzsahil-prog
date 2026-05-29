const fs = require('fs');
const path = require('path');

/**
 * Generates visitor stats badge
 * Using profile view counter service
 */
function generateVisitorStats() {
  const owner = 'itzsahil-prog';

  // Using GitHub profile views counter
  const visitorBadge = `![Profile Views](https://komarev.com/ghpvc/?username=${owner}&color=blue&style=flat-square)`;

  return visitorBadge;
}

/**
 * Generates activity stats
 */
function generateActivityStats() {
  const stats = `
### 📊 My GitHub Stats

\`\`\`
This section will display:
- Contribution graphs
- Language distribution
- Repository statistics
- Activity timeline
\`\`\`

#### Quick Stats:
- 🔥 Streak maintained with consistent contributions
- 📈 Growing portfolio of projects
- 🎯 Focus on quality and innovation
`;

  return stats;
}

/**
 * Generates tech stack section
 */
function generateTechStack() {
  const techStack = `
## 🛠️ Tech Stack

**Languages:** JavaScript, TypeScript, Python, Java

**Frontend:** React, Next.js, Tailwind CSS

**Backend:** Node.js, Express, FastAPI

**Databases:** MongoDB, PostgreSQL, Firebase

**Tools:** Git, Docker, GitHub Actions, VS Code
`;

  return techStack;
}

/**
 * Updates README with visitor stats and additional info
 */
async function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');

  try {
    let readme = '';
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf-8');
    }

    const visitorStats = generateVisitorStats();
    const activityStats = generateActivityStats();
    const techStack = generateTechStack();

    // Add visitor badge at the top if not present
    if (!readme.includes('komarev.com/ghpvc')) {
      readme = `${visitorStats}\n\n${readme}`;
    }

    // Update or add activity stats
    const activityStartMarker = '<!-- ACTIVITY_START -->';
    const activityEndMarker = '<!-- ACTIVITY_END -->';

    if (readme.includes(activityStartMarker)) {
      readme = readme.replace(
        new RegExp(`${activityStartMarker}[\\s\\S]*?${activityEndMarker}`),
        `${activityStartMarker}\n${activityStats}\n${activityEndMarker}`
      );
    } else {
      readme += `\n${activityStartMarker}\n${activityStats}\n${activityEndMarker}\n`;
    }

    // Update or add tech stack
    const techStartMarker = '<!-- TECH_START -->';
    const techEndMarker = '<!-- TECH_END -->';

    if (readme.includes(techStartMarker)) {
      readme = readme.replace(
        new RegExp(`${techStartMarker}[\\s\\S]*?${techEndMarker}`),
        `${techStartMarker}\n${techStack}\n${techEndMarker}`
      );
    } else {
      readme += `\n${techStartMarker}\n${techStack}\n${techEndMarker}\n`;
    }

    fs.writeFileSync(readmePath, readme);
    console.log('✅ Visitor stats and activity updated');
  } catch (error) {
    console.error('❌ Error updating visitor stats:', error);
    process.exit(1);
  }
}

// Run the update
updateReadme();
