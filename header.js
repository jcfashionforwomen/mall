// ✅ Toggle sidebar open
function toggleSidebar() {
  const sidebar = document.getElementById("mobileSidebar");
  if (sidebar) {
    sidebar.classList.add("open");
  }
}

// ✅ Close sidebar on button click
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("closeSidebar");
  const sidebar = document.getElementById("mobileSidebar");

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", function () {
      sidebar.classList.remove("open");
    });
  }
});
