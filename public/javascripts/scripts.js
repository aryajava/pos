const hideAlert = (id) => {
  setTimeout(() => {
    const alertElement = document.getElementById(id);
    if (alertElement) {
      alertElement.style.display = "none";
    }
  }, 3000);
};
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("success-alert")) {
    hideAlert("success-alert");
  }
  if (document.getElementById("error-alert")) {
    hideAlert("error-alert");
  }
});