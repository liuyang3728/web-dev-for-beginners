// Initialize the current project index
let currentProject = 0;

// Select all elements with the class 'project' and store them in a NodeList
const projects = document.querySelectorAll('.project');

// Function to show the project at the given index and hide others
function showProject(index) {
    projects.forEach((project, i) => {
        project.style.display = (i === index) ? 'block' : 'none';
    });
}

// Add an event listener to the 'Next' button
document.getElementById('next-btn').addEventListener('click', () => {
     // Move to the next project, looping back to the first one if we reach the end
    currentProject = (currentProject + 1) % projects.length;
    showProject(currentProject);
});

// Add an event listener to the 'Previous' button
document.getElementById('prev-btn').addEventListener('click', () => {
     // Move to the previous project, looping back to the last one if we go below zero
    currentProject = (currentProject - 1 + projects.length) % projects.length;
    showProject(currentProject);
});

// Initialize the first project
showProject(currentProject);
