# Kitchy Product App Context

This context covers the authenticated Kitchy product app used by store operators to set up a store, manage its operational configuration, take orders through POS, prepare items in KDS, and review transactions and reports.

This file defines domain language only. It should stay stable and implementation-light even when the UI or code structure changes.

For architecture, route structure, state flow, and operational repo notes, see `PROJECT_MEMORY.md`.

## Language

### Core Entities

**User**:
The authenticated person who signs in to the product app. A User can access one or more Stores, though the current product flow appears optimized for one active Store at a time.
_Avoid_: Account, member, operator

**Store**:
The top-level business unit inside the app. A Store owns Stations, Products, Categories, Orders, Transactions, and Reports.
_Avoid_: Shop when you mean the persisted business entity

**Station**:
A preparation area within a Store that receives work for specific Products. A Store has many Stations.
_Avoid_: Kitchen when you mean the specific work unit

**Product**:
A sellable menu item offered by a Store. A Product can belong to one Category and one Station.
_Avoid_: Menu when you mean the single sellable item

**Category**:
A grouping used to organize Products within a Store. A Category helps operators browse and manage the menu.
_Avoid_: Section, tag

### Selling And Fulfillment

**POS**:
The point-of-sale workflow where the operator builds an order, chooses its order type, and takes payment.
_Avoid_: Checkout when you mean the whole in-store selling flow

**Order**:
The customer purchase intent captured by the store, including order number, order type, status, and ordered products. An Order can later appear as operational work in KDS and financial history in Transactions.
_Avoid_: Transaction, receipt

**Order Type**:
The fulfillment mode for an Order. In this app the canonical values are `DINE_IN`, `TOGO`, and `DELIVERY`.
_Avoid_: Shop type, payment type

**Order Status**:
The lifecycle state of an Order as a whole. The codebase currently uses values including `NEW`, `PREPARING`, `READY`, `PENDING`, `COOKING`, `COMPLETED`, and `CANCELLED`.
_Avoid_: KDS status when you mean store-wide order state

**KDS**:
The kitchen display workflow that shows preparation work by Station. KDS is an operational view, not the Order itself.
_Avoid_: Order board when you mean the product's kitchen workflow specifically

**KDS Card**:
One unit of visible preparation work on the KDS board. In this product, one card represents one order-station item, not the entire Order.
_Avoid_: Order when you mean the single card on the board

**KDS Status**:
The preparation state of a KDS Card. The canonical values are `PENDING`, `READY`, and `SERVED`.
_Avoid_: Order status when you mean the station-level preparation state

### Payment And History

**Transaction**:
The financial record associated with an Order. A Transaction captures payment method, amount, receipt id, and purchased items.
_Avoid_: Order when you mean payment history

**Transaction Item**:
A purchased line item inside a Transaction. It records product identity, name, price, quantity, and total.
_Avoid_: KDS card, order status item

**Receipt**:
The payment record identifier attached to a Transaction. In the current model this is represented by `receiptId`.
_Avoid_: Order number

**Payment Method**:
The way a Transaction was paid. It belongs to the Transaction, not to the Order Type.
_Avoid_: Order type

### Setup And Operations

**Onboarding**:
The first-run setup flow that creates the initial Store and default Station, then helps the user begin selling. It is a guided setup experience, not the ongoing settings area.
_Avoid_: Settings when you mean the first-run wizard

**Shop Type**:
The onboarding choice that maps to the POS default Order Type. It is a setup preference, not a separate business entity.
_Avoid_: Store, Order Type as a general synonym

**Settings**:
The operational configuration area for a Store. Settings are grouped into control-panel sections such as kitchen, sales, payments, store, devices, safety, and system.
_Avoid_: Onboarding when you mean ongoing configuration

**Control Panel Section**:
One major grouping inside Settings used to organize configuration topics. Examples include kitchen, sales, payments, store, devices, safety, and system.
_Avoid_: Page when you mean the domain grouping itself

**Quick Note**:
Reusable operator text attached during ordering or preparation workflows. It is a store configuration artifact, not a product or category.
_Avoid_: Comment when you mean the reusable preset

### Reporting

**Report**:
An analytical summary for a Store over a chosen time range. A Report includes summary metrics, top products, payment breakdown, and in month mode day-level breakdowns.
_Avoid_: Transaction list, dashboard summary

**Summary Metric**:
One headline measure in a Report, such as total revenue, total orders, or average order value.
_Avoid_: Stat when you need the business meaning to be explicit

**Top Product**:
A Product ranked by sales performance inside a Report period.
_Avoid_: Best seller when you mean a computed report result rather than a product flag

## Flagged Ambiguities

**Shop vs Store**:
The UI and onboarding language sometimes use "shop" in human-facing copy, but the persisted business entity and canonical domain term should be **Store**.

**Menu vs Product**:
Some code uses `IMenu` and onboarding talks about adding menu items, but the canonical domain term for one sellable item should be **Product**.

**Transaction vs Order**:
The current implementation partially normalizes transaction data from order-shaped payloads, but domain-wise they are different. Use **Order** for the purchase/fulfillment record and **Transaction** for the financial record.

**Kitchen vs Station**:
Settings has a "kitchen" section, but the operational unit that owns preparation work is **Station**. Use **Station** when referring to the entity.

## Example Dialogue

Developer: When a new user signs up, what do they create first?

Domain expert: They go through Onboarding to create their first Store and its default Station.

Developer: When they start selling, do they create a Transaction in POS?

Domain expert: They create an Order in POS. Payment creates or completes the Transaction associated with that Order.

Developer: On the KDS board, is one card the whole Order?

Domain expert: No. One KDS Card is one order-station item. A single Order can create multiple cards if its Products belong to different Stations.

Developer: Is delivery a payment choice?

Domain expert: No. Delivery is an Order Type. Payment Method belongs to the Transaction.

Developer: If the owner changes menu structure later, is that part of Onboarding?

Domain expert: No. After setup, that belongs in Settings, where they manage Products, Categories, Stations, and other Store configuration.
