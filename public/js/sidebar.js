const sidebar = document.getElementById("sidebar");

function toggleSidebar() {
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    sidebar.style.width = '0';
  } else {
    sidebar.classList.add('active');
    sidebar.style.width = '15em';
  }
}