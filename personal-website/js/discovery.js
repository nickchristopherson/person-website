// Function to toggle content sections
function toggleContent(id) {
    const content = document.getElementById(id);
    const card = content.closest('.discovery-card');
    const expandIcon = card.querySelector('.expand-icon');
    
    // Close all other sections
    document.querySelectorAll('.card-content').forEach(item => {
        if (item.id !== id && item.classList.contains('active')) {
            item.classList.remove('active');
            const otherIcon = item.closest('.discovery-card').querySelector('.expand-icon');
            otherIcon.textContent = '+';
            otherIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Toggle current section
    content.classList.toggle('active');
    
    // Update expand icon
    if (content.classList.contains('active')) {
        expandIcon.textContent = '−';
        expandIcon.style.transform = 'rotate(180deg)';
    } else {
        expandIcon.textContent = '+';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

// Add smooth scrolling for resource links
document.querySelectorAll('.resource-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        document.querySelector(target).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize any interactive elements when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // You can add initialization code here
});