const hideAlert = (id) => {
  setTimeout(() => {
    const alertElement = document.getElementById(id);
    if (alertElement) {
      alertElement.style.display = "none";
    }
  }, 3000);
};
$(document).ready(function () {
  if ($("#success-alert")) {
    hideAlert("success-alert");
  }
  if ($("#error-alert")) {
    hideAlert("error-alert");
  }
  $("#dataTableUsers").DataTable({
    responsive: true,
    searching: true,
    lengthMenu: [3, 10, 100],
    language: {
      lengthMenu: "Show _MENU_entries",
      paginate: {
        first: null,
        previous: "Previous",
        next: "Next",
        last: null,
      }
    },
    sortable: true,
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   if (document.getElementById("success-alert")) {
//     hideAlert("success-alert");
//   }
//   if (document.getElementById("error-alert")) {
//     hideAlert("error-alert");
//   }
//   const table = new DataTable("#dataTableUsers", {
//     searchable: true,
//     sortable: true,
//     perPageSelect: true,
//     perPage: 5,
//     labels: {
//       perPage: "{select}",
//     },
//   });
// });