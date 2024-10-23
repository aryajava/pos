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
      emptyTable: "No data available in table",
      lengthMenu: "Show _MENU_ entries",
      paginate: {
        first: null,
        previous: "Previous",
        next: "Next",
        last: null,
      },
      sort: "ascending",
    },
    sortable: true,
    ajax: {
      url: "/users/api/users",
      dataSrc: "data",
    },
    columns: [
      { data: "userid" },
      { data: "email" },
      { data: "name" },
      { data: "role" },
      {
        data: "userid",
        render: function (data, type, row) {
          return `
            <a href="/users/edit/${data}" class="btn btn-success btn-sm mr-1">
              <i class="fas fa-pencil-alt"></i>
            </a>
            <button class="btn btn-danger delete-btn ml-1 btn-sm" data-id="${data}">
              <i class="fas fa-trash"></i>
            </button>
          `;
        },
        orderable: false // Disable sorting for this column
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $('td', row).addClass('align-middle');
    }
  });

  // Event listener for delete button
  $('#dataTableUsers').on('click', '.delete-btn', function () {
    const userId = $(this).data('id');
    $('#deleteModal').data('id', userId).modal('show');
  });

  // Event listener for confirm delete button
  $('#confirmDelete').on('click', function () {
    const userId = $('#deleteModal').data('id');
    $.ajax({
      url: `/users/delete/${userId}`,
      method: 'DELETE',
      success: function (response) {
        $('#deleteModal').modal('hide');
        $('#dataTableUsers').DataTable().ajax.reload();
      },
      error: function (error) {
        console.error('Error deleting user:', error);
        $('#deleteModal').modal('hide');
      }
    });
  });
});