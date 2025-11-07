let allProjects = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadAndRenderProjects();
    setupSearch();
});

async function loadAndRenderProjects() {
    try {
        const response = await fetch('data.yaml');
        if (!response.ok) {
            throw new Error('Failed to load data.yaml');
        }

        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);

        allProjects = data.projects;
        renderProjects(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        const container = document.getElementById('projects-container');
        container.innerHTML = '<div class="empty-state">Error loading projects data</div>';
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterProjects(searchTerm);
    });
}

function filterProjects(searchTerm) {
    if (!searchTerm) {
        renderProjects(allProjects);
        return;
    }

    const filteredProjects = allProjects.map(project => {
        const projectNameMatch = project.name.toLowerCase().includes(searchTerm);
        const projectDescMatch = project.description.toLowerCase().includes(searchTerm);

        const matchingRepos = project.repos.filter(repo =>
            repo.name.toLowerCase().includes(searchTerm) ||
            repo.language.toLowerCase().includes(searchTerm)
        );

        if (projectNameMatch || projectDescMatch || matchingRepos.length > 0) {
            return {
                ...project,
                repos: matchingRepos.length > 0 ? matchingRepos : project.repos,
                expanded: matchingRepos.length > 0
            };
        }

        return null;
    }).filter(project => project !== null);

    renderProjects(filteredProjects);
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    if (!projects || projects.length === 0) {
        container.innerHTML = '<div class="empty-state">No projects found</div>';
        return;
    }

    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const header = document.createElement('div');
    header.className = 'project-header';

    const projectInfo = document.createElement('div');
    projectInfo.className = 'project-info';

    const projectTitle = document.createElement('div');
    projectTitle.className = 'project-title';

    const folderIcon = document.createElement('span');
    folderIcon.className = 'folder-icon';
    folderIcon.textContent = '📁';

    const projectName = document.createElement('span');
    projectName.className = 'project-name';
    projectName.textContent = project.name;

    projectTitle.appendChild(folderIcon);
    projectTitle.appendChild(projectName);

    const projectDescription = document.createElement('div');
    projectDescription.className = 'project-description';
    projectDescription.textContent = project.description;

    projectInfo.appendChild(projectTitle);
    projectInfo.appendChild(projectDescription);

    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.textContent = project.repos && project.repos.length > 0 ? '∧' : '∨';

    header.appendChild(projectInfo);
    header.appendChild(toggleIcon);

    const reposList = document.createElement('div');
    reposList.className = 'repos-list';

    if (project.repos && project.repos.length > 0) {
        project.repos.forEach(repo => {
            const repoItem = createRepoItem(repo);
            reposList.appendChild(repoItem);
        });

        header.addEventListener('click', () => {
            const isActive = reposList.classList.contains('active');

            if (isActive) {
                reposList.classList.remove('active');
                toggleIcon.classList.remove('expanded');
            } else {
                reposList.classList.add('active');
                toggleIcon.classList.add('expanded');
            }
        });

        if (project.expanded) {
            reposList.classList.add('active');
            toggleIcon.classList.add('expanded');
        }
    } else {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No repositories';
        reposList.appendChild(emptyState);
        header.style.cursor = 'default';
    }

    card.appendChild(header);
    card.appendChild(reposList);

    return card;
}

function createRepoItem(repo) {
    const item = document.createElement('div');
    item.className = 'repo-item';

    const repoInfo = document.createElement('div');
    repoInfo.className = 'repo-info';

    const repoName = document.createElement('div');
    repoName.className = 'repo-name';
    repoName.textContent = repo.name;

    const repoMeta = document.createElement('div');
    repoMeta.className = 'repo-meta';

    const repoLanguage = document.createElement('div');
    repoLanguage.className = 'repo-language';
    repoLanguage.textContent = repo.language;

    const separator = document.createElement('span');
    separator.textContent = '•';

    const repoUpdated = document.createElement('div');
    repoUpdated.className = 'repo-updated';
    repoUpdated.textContent = repo.updated;

    repoMeta.appendChild(repoLanguage);
    repoMeta.appendChild(separator);
    repoMeta.appendChild(repoUpdated);

    repoInfo.appendChild(repoName);
    repoInfo.appendChild(repoMeta);

    const viewLink = document.createElement('a');
    viewLink.className = 'view-link';
    viewLink.href = repo.url;
    viewLink.target = '_blank';
    viewLink.textContent = 'View';

    const externalIcon = document.createElement('span');
    externalIcon.className = 'external-icon';
    externalIcon.textContent = '↗';

    viewLink.appendChild(externalIcon);

    item.appendChild(repoInfo);
    item.appendChild(viewLink);

    return item;
}
