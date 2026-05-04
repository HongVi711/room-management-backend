import { PaymentExportData } from "../services/payment-export.service";
import * as fs from "fs";
import * as path from "path";

const getLogoBase64 = () => {
  const filePath = path.resolve(process.cwd(), "src/templates/logo-base64.txt");
  const base64 = fs.readFileSync(filePath, "utf-8");

  return `data:image/png;base64,${base64}`;
};

export const generatePaymentPDFContent = (
  payment: PaymentExportData,
): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const logoBase64 = getLogoBase64();

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />

<style>
  body {
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    background: white;
    color: #1e293b;
  }

  .container { padding: 16px; }

  .card {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }

  .text-right { text-align: right; }
  .text-center { text-align: center; }

  .text-sm { font-size: 14px; }
  .text-xs { font-size: 12px; }

  .text-slate-600 { color: #475569; }
  .text-slate-900 { color: #0f172a; }

  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }

  .mb-2 { margin-bottom: 8px; }
  .mb-4 { margin-bottom: 16px; }
  .mt-2 { margin-top: 8px; }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 16px;
  }

  thead tr {
    border-bottom: 2px solid #0f172a;
  }

  tbody tr {
    border-bottom: 1px solid #e2e8f0;
  }

  .border-bold {
    border-bottom: 2px solid #0f172a;
  }

  .text-xl { font-size: 20px; }

  .text-red { color: #ef4444; }

  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 120px;
    color: rgba(0,0,0,0.08);
    z-index: -1;
    font-weight: bold;
  }

  .flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.space-y-2 > div {
  margin-bottom: 8px;
}

.text-left {
  text-align: left;
}
  
.leading-tight {
  line-height: 1.2;
}

.leading-none {
  line-height: 1;
}
</style>
</head>

<body>
<div class="container">
<div class="card">

<!-- HEADER -->
<div class="grid">
 <div class="leading-none">
  <img src="${logoBase64}" style="height:48px" />

  <p class="text-slate-600" style="margin-bottom: 0; line-height: 1;">
    DEE HOME
  </p>

  <p class="text-slate-600 text-sm" style="margin-bottom: 0; line-height: 1;">
    Điện thoại: ...
  </p>

  <p class="text-slate-600 text-sm" style="margin-bottom: 0; line-height: 1;">
    Email: ...
  </p>
</div>

  <div class="text-right">
  <h2 class="font-bold text-center" style="font-size: 20px; margin-bottom: 16px;">
    ${payment.roomName}
  </h2>

  <div class="text-sm space-y-2">
    
    <div class="flex justify-between">
      <span class="text-slate-600 text-left">Số hóa đơn:</span>
      <span class="font-bold text-slate-900">${payment.invoiceId}</span>
    </div>

    <div class="flex justify-between">
      <span class="text-slate-600">Ngày lập hóa đơn:</span>
      <span class="font-semibold text-slate-900">
        ${new Date(payment.paymentDate).toLocaleDateString("vi-VN")}
      </span>
    </div>

    <div class="flex justify-between">
      <span class="text-slate-600">Người thuê:</span>
      <span class="font-semibold text-slate-900">${payment.tenantName}</span>
    </div>

  </div>
</div>
</div>

<!-- TABLE -->
<table>
<thead>
<tr>
  <th align="left">Mô tả</th>
  <th align="right">Đơn giá</th>
  <th align="right">SL</th>
  <th align="right">Thành tiền</th>
</tr>
</thead>

<tbody>

${
  payment.rentAmount
    ? `
<tr>
  <td>
    <div class="font-medium">Tiền thuê ${payment.month}/${payment.year}</div>
    <div class="text-xs text-slate-600">${payment.roomName}</div>
  </td>
  <td align="right">${formatCurrency(payment.rentAmount)}</td>
  <td align="right">1</td>
  <td align="right"><b>${formatCurrency(payment.rentAmount)}</b></td>
</tr>
`
    : ""
}

${
  payment.electricityCost && payment.electricityCost > 0
    ? `
<tr>
  <td>
    <div class="font-medium">Tiền điện</div>
    <div class="text-xs text-slate-600">
      CSĐ cũ: ${payment.electricityPrevious || 0} | CSĐ mới: ${payment.electricityCurrent || 0} | Sử dụng: ${payment.electricityUsage || 0} kWh
    </div>
  </td>
  <td align="right">${formatCurrency(payment.electricityUnitPrice || 0)}</td>
  <td align="right">${payment.electricityUsage || 0} kWh</td>
  <td align="right"><b>${formatCurrency(payment.electricityCost)}</b></td>
</tr>
`
    : ""
}

${
  payment.waterCost && payment.waterCost > 0
    ? `
<tr>
  <td>
    <div class="font-medium">Tiền nước</div>
    <div class="text-xs text-slate-600">
      ${
        payment.isWaterPricePerPerson === false
          ? `CSĐ cũ: ${payment.waterPrevious || 0} | CSĐ mới: ${payment.waterCurrent || 0} | Sử dụng: ${payment.waterUsage} m³`
          : `Tính theo người: ${formatCurrency(payment.waterUnitPrice || 0)}/người`
      }
    </div>
  </td>
  <td align="right">${formatCurrency(payment.waterUnitPrice || 0)}</td>
  <td align="right">
    ${
      payment.isWaterPricePerPerson === false
        ? `${payment.waterUsage} m³`
        : `${payment.memberCount ?? 0} người`
    }
  </td>
  <td align="right"><b>${formatCurrency(payment.waterCost)}</b></td>
</tr>
`
    : ""
}

${
  payment.parkingFee && payment.parkingFee > 0
    ? `
<tr>
  <td>
    <div class="font-medium">Gửi xe</div>
  </td>
  <td align="right">${formatCurrency(payment.parkingFee)}</td>
  <td align="right">${payment.vehicleCount ?? 0}</td>
  <td align="right"><b>${formatCurrency(payment.parkingFee * (payment.vehicleCount ?? 0))}</b></td>
</tr>
`
    : ""
}

${
  payment.livingFee && payment.livingFee > 0
    ? `
<tr>
  <td>Phí sinh hoạt</td>
  <td align="right">${formatCurrency(payment.livingFee)}</td>
  <td align="right">1</td>
  <td align="right"><b>${formatCurrency(payment.livingFee)}</b></td>
</tr>
`
    : ""
}

${
  payment.otherFee && payment.otherFee > 0
    ? `
<tr>
  <td>Phí khác</td>
  <td align="right">${formatCurrency(payment.otherFee)}</td>
  <td align="right">1</td>
  <td align="right"><b>${formatCurrency(payment.otherFee)}</b></td>
</tr>
`
    : ""
}

<tr class="border-bold">
  <td><b>Tổng cộng</b></td>
  <td></td>
  <td></td>
  <td align="right" class="text-red text-xl">
    <b>${formatCurrency(payment.amount)}</b>
  </td>
</tr>

</tbody>
</table>

</div>
</div>

</body>
</html>
`;
};
