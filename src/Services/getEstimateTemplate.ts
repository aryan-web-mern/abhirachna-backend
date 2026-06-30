export const generateEstimateHtml = (estimate: any) => {
  const {
    AreaDetails = {},
    squareFeetRange,
    totalPerSqftCost,
    minEstimate,
    maxEstimate,
    layoutType,
    selectedDesignOptions = [],
    createdBy = {},
  } = estimate;

  const areaDetailsHtml = Object.entries(AreaDetails)
    .filter(([key, value]) => typeof value === "number") // only readable fields
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("");

  const designOptionsHtml = selectedDesignOptions
    .map((opt: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${opt.category}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${opt.label}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">₹${opt.pricePerSqft}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${(opt.details || []).join(", ")}</td>
      </tr>
    `)
    .join("");

  return `
  <div style="font-family: sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <h2 style="text-align: center; color: #007BFF;">Estimate Summary</h2>
    <p><strong>Customer Name:</strong> ${createdBy?.fullName || "-"}</p>
    <p><strong>Phone:</strong> ${createdBy?.phoneNumber || "-"}</p>
    <p><strong>Layout:</strong> ${layoutType}</p>
    <p><strong>Sq. Ft. Range:</strong> ${squareFeetRange}</p>
    <p><strong>Cost Per Sq. Ft.:</strong> ₹${totalPerSqftCost}</p>
    <p><strong>Total Estimate:</strong> ₹${minEstimate} - ₹${maxEstimate}</p>

    <h3 style="color: #FF8C00;">Area Details</h3>
    <ul>
      ${areaDetailsHtml}
    </ul>

    <h3 style="color: #FF8C00;">Selected Design Options</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #007BFF; color: white;">
          <th style="padding: 8px; border: 1px solid #ccc;">Category</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Label</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Price/Sqft</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Details</th>
        </tr>
      </thead>
      <tbody>
        ${designOptionsHtml}
      </tbody>
    </table>
  </div>`;
};
