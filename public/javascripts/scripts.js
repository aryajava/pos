const hideAlert = (id) => {
  $(`#${id}`);
};

$(document).ready(function () {
  if ($('#success-alert').length) {
    hideAlert('success-alert');
  }
  if ($('#error-alert').length) {
    hideAlert('error-alert');
  }

  // Initialize DataTable for users
  $("#dataTableUser").DataTable({
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
            <button class="btn btn-danger delete-btn ml-1 btn-sm" data-id="${data}" data-type="user">
              <i class="fas fa-trash"></i>
            </button>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $('td', row).addClass('align-middle');
    }
  });

  // Initialize DataTable for units
  $("#dataTableUnit").DataTable({
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
      url: "/units/api/units",
      dataSrc: "data",
    },
    columns: [
      { data: "unit" },
      { data: "name" },
      { data: "note" },
      {
        data: "unit",
        render: function (data, type, row) {
          return `
            <a href="/units/edit/${data}" class="btn btn-success btn-sm mr-1">
              <i class="fas fa-pencil-alt"></i>
            </a>
            <button class="btn btn-danger delete-btn ml-1 btn-sm" data-id="${data}" data-type="unit">
              <i class="fas fa-trash"></i>
            </button>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $('td', row).addClass('align-middle');
    }
  });

  // Event delegation for delete button
  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    const type = $(this).data('type');
    $('#deleteModal').data('id', id).data('type', type).modal('show');
  });

  // Event listener for confirm delete button
  $('#confirmDelete').on('click', function () {
    const id = $('#deleteModal').data('id');
    const type = $('#deleteModal').data('type');
    const url = type === 'user' ? `/users/delete/${id}` : `/units/delete/${id}`;

    $.ajax({
      url: url,
      method: 'DELETE',
      success: function (response) {
        $('#deleteModal').modal('hide');
        if (type === 'user') {
          $('#dataTableUser').DataTable().ajax.reload();
        } else {
          $('#dataTableUnit').DataTable().ajax.reload();
        }
      },
      error: function (error) {
        console.error(`Error deleting ${type}:`, error);
        $('#deleteModal').modal('hide');
      }
    });
  });
});