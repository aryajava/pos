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
      { data: "email", className: "user-email" },
      { data: "name", className: "user-name" },
      { data: "role", className: "user-role" },
      {
        data: "userid",
        render: function (data, type, row) {
          return `
            <div class="action-buttons">
              <a href="/users/edit/${data}" class="btn btn-success m-1">
                <i class="fas fa-pencil-alt"></i>
              </a>
              <button class="btn btn-danger delete-btn m-1" data-id="${data}" data-type="user">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr('id', `user-${data.userid}`);
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
      { data: "unit", className: "unit-unit" },
      { data: "name", className: "unit-name" },
      { data: "note", className: "unit-note" },
      {
        data: "unit",
        render: function (data, type, row) {
          return `
            <div class="action-buttons">
              <a href="/units/edit/${data}" class="btn btn-success m-1">
                <i class="fas fa-pencil-alt"></i>
              </a>
              <button class="btn btn-danger delete-btn m-1" data-id="${data}" data-type="unit">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr('id', `unit-${data.unit}`);
      $('td', row).addClass('align-middle');
    }
  });

  // Initialize DataTable for goods
  $("#dataTableGoods").DataTable({
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
      url: "/goods/api/goods",
      dataSrc: "data",
    },
    columns: [
      { data: "barcode" },
      { data: "name", className: "goods-name" },
      { data: "stock", className: "goods-stock" },
      { data: "unit", className: "goods-unit" },
      {
        data: "purchaseprice", className: "goods-purchaseprice",
        render: function (data, type, row) {
          return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data);
        }
      },
      {
        data: "sellingprice", className: "goods-sellingprice",
        render: function (data, type, row) {
          return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data);
        }
      },
      {
        data: "picture",
        render: function (data, type, row) {
          const imageUrl = data ? data : 'asset/svg/no-image.svg';
          return `<img src="${imageUrl}" class="goods-picture" alt="Picture" style="width: 100px; height: auto;" />`;
        },
        orderable: false
      },
      {
        data: "barcode",
        render: function (data, type, row) {
          return `
            <div class="action-buttons">
              <a href="/goods/edit/${data}" class="btn btn-success m-1">
                <i class="fas fa-pencil-alt"></i>
              </a>
              <button class="btn btn-danger delete-btn m-1" data-id="${data}" data-type="goods">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr('id', `goods-${data.barcode}`);
      $('td', row).addClass('align-middle');
    }
  });

  // Initialize DataTable for suppliers
  $("#dataTableSupplier").DataTable({
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
      url: "/suppliers/api/suppliers",
      dataSrc: "data",
    },
    columns: [
      { data: "supplierid" },
      { data: "name", className: "supplier-name" },
      { data: "address", className: "supplier-address" },
      { data: "phone", className: "supplier-phone" },
      {
        data: "supplierid",
        render: function (data, type, row) {
          return `
            <div class="action-buttons">
              <a href="/suppliers/edit/${data}" class="btn btn-success m-1">
                <i class="fas fa-pencil-alt"></i>
              </a>
              <button class="btn btn-danger delete-btn m-1" data-id="${data}" data-type="supplier">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr('id', `supplier-${data.supplierid}`);
      $('td', row).addClass('align-middle');
    }
  });

  // Initialize DataTable for customers
  $("#dataTableCustomer").DataTable({
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
      url: "/customers/api/customers",
      dataSrc: "data",
    },
    columns: [
      { data: "customerid" },
      { data: "name", className: "customer-name" },
      { data: "address", className: "customer-address" },
      { data: "phone", className: "customer-phone" },
      {
        data: "customerid",
        render: function (data, type, row) {
          return `
          <div class="action-buttons">
          <a href="/customers/edit/${data}" class="btn btn-success m-1">
          <i class="fas fa-pencil-alt"></i>
          </a>
          <button class="btn btn-danger delete-btn m-1" data-id="${data}" data-type="customer">
          <i class="fas fa-trash"></i>
          </button>
          </div>
          `;
        },
        orderable: false
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr('id', `customer-${data.customerid}`);
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
    let url = '';
    if (type === 'user') {
      url = `/users/delete/${id}`;
    } else if (type === 'unit') {
      url = `/units/delete/${id}`;
    } else if (type === 'goods') {
      url = `/goods/delete/${id}`;
    } else if (type === 'supplier') {
      url = `/suppliers/delete/${id}`;
    } else if (type === 'purchase') {
      url = `/purchases/delete/${id}`;
    } else if (type === 'customer') {
      url = `/customers/delete/${id}`;
    } else if (type === 'sale') {
      url = `/sales/delete/${id}`;
    }
    if (url) {
      $.ajax({
        url: url,
        method: 'DELETE',
        success: function (response) {
          $('#deleteModal').modal('hide');
          if (type === 'user') {
            $('#dataTableUser').DataTable().ajax.reload();
          } else if (type === 'unit') {
            $('#dataTableUnit').DataTable().ajax.reload();
          } else if (type === 'goods') {
            $('#dataTableGoods').DataTable().ajax.reload();
          } else if (type === 'supplier') {
            $('#dataTableSupplier').DataTable().ajax.reload();
          } else if (type === 'purchase') {
            $('#dataTablePurchase').DataTable().ajax.reload();
          } else if (type === 'customer') {
            $('#dataTableCustomer').DataTable().ajax.reload();
          } else if (type === 'sale') {
            $('#dataTableSale').DataTable().ajax.reload();
          }
        },
        error: function (error) {
          console.error(`Error deleting ${type}:`, error);
          $('#deleteModal').modal('hide');
        }
      });
    }
  });
});