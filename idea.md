Invoice Generator Web App
Objective: Design and build a Full-Stack Invoicing Application using the MERN stack
(MongoDB, Express, React, Node.js). The application should allow users to manage
items, create invoices with complex calculations, save them to a database, and
download them as a PDF.
Core Modules & Requirements:
Module 1: Item & Inventory Management
● Create an interface to add, edit, and view Items.
● Fields required: Item Name, Description, Variants (e.g., Size, Color, or Weight),
and Base Price.
● Note: These items should be saved in the database and fetched when creating a
new invoice.
Module 2: Invoice Metadata & Customer Details
● Create a "New Invoice" screen.
● Auto-generated Fields: Unique Invoice Number, Current Date.
● Customer Details (Input fields): Full Name, Phone Number, Email ID, and
Billing Address.
Module 3: Line Items & Mathematical Logic
● A dynamic section to add multiple items to the current invoice (fetched from
Module 1).
● For each line item added, the user must be able to specify:
○ Quantity
○ GST % (e.g., 5%, 12%, 18%)
○ Discount (Toggle between % or Absolute Amount)
● Live Calculations: As quantities, GST, or discounts change, the row total
should update instantly on the frontend.
● Invoice Summary: At the bottom, display the overall Subtotal, Total GST, Total
Discount, and Final Grand Total.
Module 4: PDF Generation & Persistence
● Save Invoice: A button to save the invoice data to the MongoDB database.
● Download PDF: A button to generate and download a well-formatted PDF of
the invoice.
● The PDF must include:
○ All customer details and invoice metadata.
○ A clean table of the line items with their individual taxes and discounts.
○ The final calculation summary.
○ Pre-written Terms & Conditions at the very bottom (e.g., "Payment is
due within 15 days. Subject to local jurisdiction.").
Module 5: Invoice History (Dashboard)
● A simple dashboard/list page showing all previously generated invoices.
● Show basic details: Invoice Number, Customer Name, Date, and Grand Total.
🛠️ Tech Stack & Constraints
● Frontend: Choose Yourself
● Backend: Node.js
● Database: MongoDB
