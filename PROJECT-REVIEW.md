# Current project feature review

Reviewed individually on 27 October 2026. Descriptions are limited to implemented workflows found in the listed screens/routes. README plans, older copies, historical performance figures and test-result counts are not treated as current features. This was a source review, not a fresh execution of every application.

## vishnu-tharan/Buyora

Commit: `2b71f8e3484a9fec1f51a184dfe78f2a945f7c46`

- Product discovery and saved favourites: [BuyoraFrontend/src/app/(store)/search/SearchPageClient.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/(store)/search/SearchPageClient.jsx), [BuyoraFrontend/src/app/(store)/wishlist/page.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/(store)/wishlist/page.jsx), [BuyoraBackend/src/main/java/com/buyora/api/product/CatalogService.java](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraBackend/src/main/java/com/buyora/api/product/CatalogService.java), [BuyoraBackend/src/main/java/com/buyora/api/wishlist/WishlistService.java](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraBackend/src/main/java/com/buyora/api/wishlist/WishlistService.java)
- Checkout, stock and duplicate-order protection: [BuyoraFrontend/src/components/checkout/PaymentStep.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/components/checkout/PaymentStep.jsx), [BuyoraBackend/src/main/java/com/buyora/api/checkout/CheckoutService.java](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraBackend/src/main/java/com/buyora/api/checkout/CheckoutService.java), [BuyoraBackend/src/main/java/com/buyora/api/inventory/InventoryService.java](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraBackend/src/main/java/com/buyora/api/inventory/InventoryService.java)
- Order tracking, returns and administration: [BuyoraFrontend/src/app/(store)/track-order/page.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/(store)/track-order/page.jsx), [BuyoraFrontend/src/app/(store)/account/orders/[orderNumber]/page.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/(store)/account/orders/[orderNumber]/page.jsx), [BuyoraFrontend/src/app/admin/products/page.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/admin/products/page.jsx), [BuyoraFrontend/src/app/admin/settings/page.jsx](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraFrontend/src/app/admin/settings/page.jsx), [BuyoraBackend/src/main/java/com/buyora/api/returns/ReturnService.java](https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/BuyoraBackend/src/main/java/com/buyora/api/returns/ReturnService.java)

Catalog queries now use PostgreSQL directly; Redis is absent from the current dependencies and Docker services. Cash on delivery is enabled locally; PayHere remains conditional on sandbox configuration. Current screenshots were captured with sample products on 27 October 2026. This review did not execute Buyora or its test suites.

## vishnu-tharan/CashManage

Commit: `6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa`

- Cashbooks and financial planning: [client/src/App.jsx](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/App.jsx), [client/src/pages/PlanningPage.jsx](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/pages/PlanningPage.jsx), [client/src/ledger.js](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/ledger.js)
- Reports and encrypted backups: [client/src/pages/ReportsPage.jsx](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/pages/ReportsPage.jsx), [client/src/pages/SettingsPage.jsx](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/pages/SettingsPage.jsx), [client/src/lib/crypto.js](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/lib/crypto.js)
- Account controls and synchronization: [client/src/AccountSecurity.jsx](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/AccountSecurity.jsx), [server/accountSecurity.js](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/server/accountSecurity.js), [client/src/hooks/useWorkspace.js](https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/client/src/hooks/useWorkspace.js)

## vishnu-tharan/CEB-Management

Commit: `e708d978a9b13e72d0b193a38bfc11095c44fa61`

- Eight current household/account screens: [frontend/app.js](https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/frontend/app.js), [frontend/views.js](https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/frontend/views.js), [frontend/bills.js](https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/frontend/bills.js)
- Appliances, readings and bills: [backend/server.js](https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/backend/server.js), [frontend/energy.js](https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/frontend/energy.js)

## vishnu-tharan/CinemaStream

Commit: `abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3`

- Discovery, details and trailers: [app/(tabs)/index.jsx](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/app/(tabs)/index.jsx), [app/movie/[id].jsx](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/app/movie/[id].jsx), [src/lib/discovery.js](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/src/lib/discovery.js), [src/lib/trailers.js](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/src/lib/trailers.js)
- Online account collections: [src/contexts/auth.jsx](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/src/contexts/auth.jsx), [src/contexts/library.jsx](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/src/contexts/library.jsx), [app/(tabs)/favorites.jsx](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/app/(tabs)/favorites.jsx), [firestore.rules](https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/firestore.rules)

## vishnu-tharan/GatePilot

Commit: `94f5c069dad296877cd321bdfa54275ed7b95ba6`

- Entry, exit and approvals: [frontend/src/Workspace.jsx](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/frontend/src/Workspace.jsx), [frontend/src/screens/Entry.jsx](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/frontend/src/screens/Entry.jsx), [backend/src/routes/visits.js](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/backend/src/routes/visits.js)
- Records, accounts and organization settings: [frontend/src/screens/Records.jsx](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/frontend/src/screens/Records.jsx), [frontend/src/screens/Accounts.jsx](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/frontend/src/screens/Accounts.jsx), [frontend/src/screens/Settings.jsx](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/frontend/src/screens/Settings.jsx), [backend/src/routes/settings.js](https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/backend/src/routes/settings.js)

## chamikara12/GATEWAY

Commit: `fc205a40ccc97571adcf53ad0e60bb35f5cc7de0`

- Active admin/security dashboards: [src/index.js](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/src/index.js), [src/App.jsx](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/src/App.jsx), [src/components/AdminDashboard/GatePasses.jsx](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/src/components/AdminDashboard/GatePasses.jsx)
- Vehicle entry, exit and records: [src/components/SecurityDashboard/VehicleEntry.jsx](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/src/components/SecurityDashboard/VehicleEntry.jsx), [src/components/SecurityDashboard/VehicleExit.jsx](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/src/components/SecurityDashboard/VehicleExit.jsx), [controller/vehicleRecordController.js](https://github.com/chamikara12/GATEWAY/blob/fc205a40ccc97571adcf53ad0e60bb35f5cc7de0/controller/vehicleRecordController.js)

## dragon-udfly/LankaAgriDirect

Commit: `3142c15f1bd36017185cc24028f51849991e82ee`

- Buyer browsing and bookmarks: [mobile-app/src/screens/buyer/HomeScreen.js](https://github.com/dragon-udfly/LankaAgriDirect/blob/3142c15f1bd36017185cc24028f51849991e82ee/mobile-app/src/screens/buyer/HomeScreen.js), [mobile-app/src/screens/buyer/BookmarksScreen.js](https://github.com/dragon-udfly/LankaAgriDirect/blob/3142c15f1bd36017185cc24028f51849991e82ee/mobile-app/src/screens/buyer/BookmarksScreen.js)
- Producer listings and admin registration review: [mobile-app/src/screens/producer/MyProductsScreen.js](https://github.com/dragon-udfly/LankaAgriDirect/blob/3142c15f1bd36017185cc24028f51849991e82ee/mobile-app/src/screens/producer/MyProductsScreen.js), [admin-web/src/pages/NewRegistrationsPage.tsx](https://github.com/dragon-udfly/LankaAgriDirect/blob/3142c15f1bd36017185cc24028f51849991e82ee/admin-web/src/pages/NewRegistrationsPage.tsx), [backend/src/main/java/com/example/lankaagridirect/Services/ProducerService.java](https://github.com/dragon-udfly/LankaAgriDirect/blob/3142c15f1bd36017185cc24028f51849991e82ee/backend/src/main/java/com/example/lankaagridirect/Services/ProducerService.java)

