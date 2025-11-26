const sidebar = document.getElementById("collapseSidebar");
const sidebarBtn = document.getElementById('toggleSidebarButton');

function toggleSidebar() {
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    sidebar.style.width = '0';
  } else {
    sidebar.classList.add('active');
    sidebar.style.width = '15em';
  }
}

sidebarBtn.addEventListener('click', ()=> {
  toggleSidebar()
})

document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarBtn = document.getElementById('toggleSidebarButton');
  
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', toggleSidebar);
  }
});
