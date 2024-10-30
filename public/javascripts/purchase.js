$(document).ready(function () {
  const invoice = $('#invoice').val();

  // Load purchase data
  $.ajax({
    url: `/api/purchases/${invoice}`,
    method: 'GET',
    success: function (data) {
      // Populate form fields with data
      $('#timePurchase').val(data.time);
      $('#operator').val(data.operatorname);
      $('#totalsum').val(data.totalsum);
      $('#supplier').val(data.supplier).trigger('change');
    }
  });

  const table = $("#dataTablePurchaseItems").DataTable({
    responsive: true,
    ordering: false,
    language: {
      emptyTable: "No data available in table",
    },
    ajax: {
      url: `/api/purchases/${invoice}/items`,
      dataSrc: "data",
    },
    columns: [
      { data: null, render: function (data, type, row, meta) { return meta.row + 1; } },
      { data: "barcode" },
      { data: "name" },
      { data: "quantity" },
      { data: "purchaseprice" },
      { data: "totalprice" },
    ],
    createdRow: function (row, data, dataIndex) {
      $('td', row).addClass('align-middle');
    }
  });
});


$(document).ready(function () {
  // Initialize DataTable for purchaseItems
  $("#dataTablePurchaseItems").DataTable({
    responsive: true,
    layout: {
      topStart: null,
      topEnd: null,
      bottomStart: null,
      bottomEnd: null,
      bottom: null,
    },
    ordering: false,
    language: {
      emptyTable: "No data available in table",
    },
    ajax: {
      url: "/purchases/api/purchases/" + $('#invoice').val(),
      dataSrc: "data",
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        }
      },
      { data: "itemcode" },
      { data: "itemname" },
      { data: "quantity" },
      { data: "purchaseprice" },
      { data: "totalprice" },
    ],
    createdRow: function (row, data, dataIndex) {
      $('td', row).addClass('align-middle');
    }
  });
});