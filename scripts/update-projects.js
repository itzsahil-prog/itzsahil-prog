const fs = require('fs');
const path = require('path');

/**
 * Fetches latest projects from GitHub API
 * Filters for public repositories with recent activity
 */
async function fetchLatestProjects() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const owner = 'itzsahil-prog';

  try {
    const response = await fetch(`https://api.github.com/users/${owner}/repos?sort=updated&per_page=10`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Filter out forked repos and sort by update time
    const projects = repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description || 'No description',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        updated: new Date(repo.updated_at).toLocaleDateString(),
      }))
      .slice(0, 5); // Get top 5

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Generates markdown for projects section
 */
function generateProjectsMarkdown(projects) {
  if (projects.length === 0) {
    return '## 📚 Latest Projects\n\n_Loading projects..._\n';
  }

  let markdown = '## 📚 Latest Projects\n\n';

  projects.forEach(project => {
    markdown += `### [${project.name}](${project.url})\n`;
    markdown += `**${project.description}**\n`;
    markdown += `- 🔤 Language: ${project.language}\n`;
    markdown += `- ⭐ Stars: ${project.stars}\n`;
    markdown += `- 📅 Updated: ${project.updated}\n\n`;
  });

  return markdown;
}

/**
 * Updates README with latest projects
 */
async function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');

  try {
    // Fetch projects
    const projects = await fetchLatestProjects();
    const projectsMarkdown = generateProjectsMarkdown(projects);

    // Read current README
    let readme = '';
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf-8');
    } else {
      readme = `# Hi there 👋 I'm Sahil\n\n`;
    }

    // Replace or add projects section
    const projectsStartMarker = '<!-- PROJECTS_START -->';
    const projectsEndMarker = '<!-- PROJECTS_END -->';

    if (readme.includes(projectsStartMarker)) {
      readme = readme.replace(
        new RegExp(`${projectsStartMarker}[\\s\\S]*?${projectsEndMarker}`),
        `${projectsStartMarker}\n${projectsMarkdown}${projectsEndMarker}`
      );
    } else {
      readme += `\n${projectsStartMarker}\n${projectsMarkdown}${projectsEndMarker}\n`;
    }

    // Write updated README
    fs.writeFileSync(readmePath, readme);
    console.log('✅ README updated with latest projects');
  } catch (error) {
    console.error('❌ Error updating README:', error);
    process.exit(1);
  }
}

// Run the update
updateReadme();
