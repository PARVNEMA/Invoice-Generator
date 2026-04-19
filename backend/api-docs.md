# HealthyChef Invoice Generator — API Documentation

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents

- [Items](#items)
  - [GET /items](#get-items)
  - [GET /items/:id](#get-itemsid)
  - [POST /items](#post-items)
  - [PUT /items/:id](#put-itemsid)
  - [DELETE /items/:id](#delete-itemsid)
- [Invoices](#invoices)
  - [GET /invoices](#get-invoices)
  - [GET /invoices/:id](#get-invoicesid)
  - [POST /invoices](#post-invoices)
  - [DELETE /invoices/:id](#delete-invoicesid)
  - [GET /invoices/:id/pdf](#get-invoicesidpdf)
- [Error Responses](#error-responses)

---

## Items

### GET /items

Fetch all items saved in the database.

**URL:** `GET /api/items`

**Params:** None

**Success Response — 200**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664abc123...",
      "name": "Grilled Chicken Salad",
      "description": "High protein bowl",
      "variants": [
        { "name": "Size", "value": "Standard" }
      ],
      "basePrice": 250,
      "createdAt": "2026-04-19T10:00:00.000Z",
      "updatedAt": "2026-04-19T10:00:00.000Z"
    }
  ]
}
```

---

### GET /items/:id

Fetch a single item by its ID.

**URL:** `GET /api/items/:id`

**URL Params:**

| Param | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| id    | string | Required | MongoDB ObjectId of the item |

**Success Response — 200**
```json
{
  "success": true,
  "data": {
    "_id": "664abc123...",
    "name": "Grilled Chicken Salad",
    "description": "High protein bowl",
    "variants": [
      { "name": "Size", "value": "Standard" }
    ],
    "basePrice": 250
  }
}
```

**Error Response — 404**
```json
{
  "success": false,
  "message": "Item not found"
}
```

---

### POST /items

Create a new item.

**URL:** `POST /api/items`

**Request Body:**

| Field       | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| name        | string | Required | Item name                            |
| description | string | Optional | Short description of the item        |
| variants    | array  | Optional | Array of `{ name, value }` objects   |
| basePrice   | number | Required | Price per unit in ₹                  |

**Example Request Body:**
```json
{
  "name": "Brown Jeera Rice",
  "description": "1 Portion",
  "variants": [
    { "name": "Weight", "value": "200g" }
  ],
  "basePrice": 150
}
```

**Success Response — 201**
```json
{
  "success": true,
  "data": {
    "_id": "664def456...",
    "name": "Brown Jeera Rice",
    "description": "1 Portion",
    "variants": [{ "name": "Weight", "value": "200g" }],
    "basePrice": 150,
    "createdAt": "2026-04-19T10:05:00.000Z",
    "updatedAt": "2026-04-19T10:05:00.000Z"
  }
}
```

---

### PUT /items/:id

Update an existing item.

**URL:** `PUT /api/items/:id`

**URL Params:**

| Param | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| id    | string | Required | MongoDB ObjectId of the item |

**Request Body** (send only the fields you want to update):

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| name        | string | Optional | Updated item name                  |
| description | string | Optional | Updated description                |
| variants    | array  | Optional | Updated array of `{ name, value }` |
| basePrice   | number | Optional | Updated price in ₹                 |

**Example Request Body:**
```json
{
  "name": "Brown Jeera Rice (Large)",
  "basePrice": 180,
  "variants": [{ "name": "Weight", "value": "350g" }]
}
```

**Success Response — 200**
```json
{
  "success": true,
  "data": {
    "_id": "664def456...",
    "name": "Brown Jeera Rice (Large)",
    "basePrice": 180,
    "variants": [{ "name": "Weight", "value": "350g" }]
  }
}
```

**Error Response — 404**
```json
{
  "success": false,
  "message": "Item not found"
}
```

---

### DELETE /items/:id

Delete an item by ID.

**URL:** `DELETE /api/items/:id`

**URL Params:**

| Param | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| id    | string | Required | MongoDB ObjectId of the item |

**Success Response — 200**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## Invoices

### GET /invoices

Fetch all invoices — lightweight list for the dashboard. Does **not** include `lineItems`.

**URL:** `GET /api/invoices`

**Params:** None

**Success Response — 200**
```json
{
  "success": true,
  "data": [
    {
      "_id": "665xyz789...",
      "invoiceNumber": "INV-2026-0001",
      "customerName": "Rohan Sharma",
      "invoiceDate": "2026-04-19T10:00:00.000Z",
      "grandTotal": 1030.70
    }
  ]
}
```

---

### GET /invoices/:id

Fetch the full details of a single invoice including all line items.

**URL:** `GET /api/invoices/:id`

**URL Params:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| id    | string | Required | MongoDB ObjectId of the invoice |

**Success Response — 200**
```json
{
  "success": true,
  "data": {
    "_id": "665xyz789...",
    "invoiceNumber": "INV-2026-0001",
    "customerName": "Rohan Sharma",
    "phone": "+91-9876543210",
    "email": "rohan.sharma@example.com",
    "billingAddress": "4th Floor, Tech Park, Indiranagar, Bengaluru, 560038",
    "invoiceDate": "2026-04-19T10:00:00.000Z",
    "dueDate": "2026-05-04T10:00:00.000Z",
    "lineItems": [
      {
        "itemId": "664abc123...",
        "itemName": "Grilled Chicken Salad",
        "variantDescription": "High Protein (Standard)",
        "basePrice": 250,
        "quantity": 2,
        "gstPercent": 5,
        "discountType": "percent",
        "discountValue": 10,
        "rowTotal": 472.50
      }
    ],
    "subtotal": 1010.00,
    "totalDiscount": 70.00,
    "totalGST": 90.70,
    "grandTotal": 1030.70
  }
}
```

---

### POST /invoices

Create and save a new invoice. All calculated fields (`invoiceNumber`, `rowTotal`, `grandTotal`, etc.) are computed server-side — do not send them.

**URL:** `POST /api/invoices`

**Request Body:**

| Field          | Type   | Required | Description                       |
|----------------|--------|----------|-----------------------------------|
| customerName   | string | Required | Full name of the customer         |
| phone          | string | Required | Customer phone number             |
| email          | string | Required | Customer email address            |
| billingAddress | string | Required | Full billing address              |
| lineItems      | array  | Required | At least 1 line item (see below)  |

**lineItems[ ] object fields:**

| Field              | Type   | Required | Description                                      |
|--------------------|--------|----------|--------------------------------------------------|
| itemId             | string | Optional | Reference to `Item._id`                          |
| itemName           | string | Required | Snapshot of the item name                        |
| variantDescription | string | Optional | e.g. `"High Protein (Standard)"`                 |
| basePrice          | number | Required | Price per unit in ₹                              |
| quantity           | number | Required | Quantity ordered                                 |
| gstPercent         | number | Required | GST rate — `5`, `12`, or `18`                    |
| discountType       | string | Optional | `"percent"` or `"absolute"` (default: `"percent"`) |
| discountValue      | number | Optional | Discount amount or percentage (default: `0`)     |

> **Note:** `rowTotal` is calculated server-side — do not include it in the request.

**Example Request Body:**
```json
{
  "customerName": "Rohan Sharma",
  "phone": "+91-9876543210",
  "email": "rohan.sharma@example.com",
  "billingAddress": "4th Floor, Tech Park, Indiranagar, Bengaluru, 560038",
  "lineItems": [
    {
      "itemId": "664abc123...",
      "itemName": "Grilled Chicken Salad",
      "variantDescription": "High Protein (Standard)",
      "basePrice": 250,
      "quantity": 2,
      "gstPercent": 5,
      "discountType": "percent",
      "discountValue": 10
    },
    {
      "itemName": "Brown Jeera Rice",
      "variantDescription": "1 Portion",
      "basePrice": 150,
      "quantity": 1,
      "gstPercent": 5,
      "discountType": "absolute",
      "discountValue": 0
    },
    {
      "itemName": "Cold Pressed Juice",
      "variantDescription": "Watermelon & Basil",
      "basePrice": 120,
      "quantity": 3,
      "gstPercent": 12,
      "discountType": "absolute",
      "discountValue": 20
    }
  ]
}
```

**Success Response — 201**
```json
{
  "success": true,
  "data": {
    "_id": "665xyz789...",
    "invoiceNumber": "INV-2026-0001",
    "customerName": "Rohan Sharma",
    "invoiceDate": "2026-04-19T10:00:00.000Z",
    "dueDate": "2026-05-04T10:00:00.000Z",
    "subtotal": 1010.00,
    "totalDiscount": 70.00,
    "totalGST": 90.70,
    "grandTotal": 1030.70,
    "lineItems": [ ... ]
  }
}
```

**Error Response — 400**
```json
{
  "success": false,
  "message": "At least one line item is required"
}
```

---

### DELETE /invoices/:id

Delete an invoice by ID.

**URL:** `DELETE /api/invoices/:id`

**URL Params:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| id    | string | Required | MongoDB ObjectId of the invoice |

**Success Response — 200**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

---

### GET /invoices/:id/pdf

Download the invoice as a formatted PDF file.

**URL:** `GET /api/invoices/:id/pdf`

**URL Params:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| id    | string | Required | MongoDB ObjectId of the invoice |

**Response:**

Returns a **binary PDF stream** — not JSON.

```
Content-Type: application/pdf
Content-Disposition: attachment; filename=INV-2026-0001.pdf
```

> **Note:** To trigger a download from the frontend, simply use this URL as an anchor tag's `href`:
> ```html
> <a href="http://localhost:5000/api/invoices/665xyz789.../pdf" download>
>   Download PDF
> </a>
> ```

---

## Error Responses

All endpoints return errors in this shape:

```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```

| Status Code | Meaning                          |
|-------------|----------------------------------|
| 400         | Validation error / bad request body |
| 404         | Resource not found               |
| 500         | Internal server error            |

---

## Row Total Calculation Logic

For reference, here is how `rowTotal` is calculated per line item on the server:

```
subtotalBeforeDiscount = basePrice × quantity

if discountType === "percent":
    discountAmount = subtotalBeforeDiscount × (discountValue / 100)
else:
    discountAmount = discountValue

subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount
gstAmount             = subtotalAfterDiscount × (gstPercent / 100)
rowTotal              = subtotalAfterDiscount + gstAmount
```

**Invoice summary:**
```
subtotal      = sum of (basePrice × quantity) for all line items
totalDiscount = sum of all discountAmounts
totalGST      = sum of all gstAmounts
grandTotal    = subtotal - totalDiscount + totalGST
```