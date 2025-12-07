"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "./action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "./request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "./static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_spidersnake_Downloads_Cantine_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/spidersnake/Downloads/Cantine/src/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_spidersnake_Downloads_Cantine_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNwaWRlcnNuYWtlJTJGRG93bmxvYWRzJTJGQ2FudGluZSUyRnNyYyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZzcGlkZXJzbmFrZSUyRkRvd25sb2FkcyUyRkNhbnRpbmUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9c3RhbmRhbG9uZSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUM0QjtBQUN6RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhc2YtY2FudGluZS8/NjEwMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvc3BpZGVyc25ha2UvRG93bmxvYWRzL0NhbnRpbmUvc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvc3BpZGVyc25ha2UvRG93bmxvYWRzL0NhbnRpbmUvc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n// =============================================================================\n// Route NextAuth.js\n// =============================================================================\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxnRkFBZ0Y7QUFDaEYsb0JBQW9CO0FBQ3BCLGdGQUFnRjtBQUUvQztBQUNRO0FBRXpDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhc2YtY2FudGluZS8uL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz8wMDk4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSb3V0ZSBOZXh0QXV0aC5qc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IE5leHRBdXRoIGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcblxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcblxuZXhwb3J0IHsgaGFuZGxlciBhcyBHRVQsIGhhbmRsZXIgYXMgUE9TVCB9O1xuXG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJhdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   generateToken: () => (/* binding */ generateToken),\n/* harmony export */   hasRole: () => (/* binding */ hasRole),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   isAdmin: () => (/* binding */ isAdmin),\n/* harmony export */   isGestionnaireOrAdmin: () => (/* binding */ isGestionnaireOrAdmin),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./db */ \"(rsc)/./src/lib/db.ts\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_3__);\n// =============================================================================\n// Configuration NextAuth.js et utilitaires d'authentification\n// =============================================================================\n\n\n\n\n// =============================================================================\n// Configuration NextAuth\n// =============================================================================\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Mot de passe\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Email et mot de passe requis\");\n                }\n                // Rechercher l'utilisateur\n                const user = await _db__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email.toLowerCase()\n                    }\n                });\n                if (!user) {\n                    throw new Error(\"Email ou mot de passe incorrect\");\n                }\n                // Vérifier le statut du compte\n                if (user.status === _prisma_client__WEBPACK_IMPORTED_MODULE_3__.AccountStatus.PENDING) {\n                    throw new Error(\"Compte en attente d'activation. V\\xe9rifiez vos emails.\");\n                }\n                if (user.status === _prisma_client__WEBPACK_IMPORTED_MODULE_3__.AccountStatus.DISABLED) {\n                    throw new Error(\"Compte d\\xe9sactiv\\xe9. Contactez l'administrateur.\");\n                }\n                // Vérifier le mot de passe\n                if (!user.passwordHash) {\n                    throw new Error(\"Compte non activ\\xe9. V\\xe9rifiez vos emails.\");\n                }\n                const isValidPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.passwordHash);\n                if (!isValidPassword) {\n                    throw new Error(\"Email ou mot de passe incorrect\");\n                }\n                // Mettre à jour la date de dernière connexion\n                await _db__WEBPACK_IMPORTED_MODULE_2__.prisma.user.update({\n                    where: {\n                        id: user.id\n                    },\n                    data: {\n                        lastLoginAt: new Date()\n                    }\n                });\n                return {\n                    id: user.id,\n                    email: user.email,\n                    firstName: user.firstName,\n                    lastName: user.lastName,\n                    role: user.role,\n                    canteenAccountNumber: user.canteenAccountNumber\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.email = user.email;\n                token.firstName = user.firstName;\n                token.lastName = user.lastName;\n                token.role = user.role;\n                token.canteenAccountNumber = user.canteenAccountNumber;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            session.user = {\n                id: token.id,\n                email: token.email,\n                firstName: token.firstName,\n                lastName: token.lastName,\n                role: token.role,\n                canteenAccountNumber: token.canteenAccountNumber\n            };\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth/login\",\n        error: \"/auth/login\"\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 24 * 60 * 60\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n// =============================================================================\n// Utilitaires pour les mots de passe\n// =============================================================================\n/**\n * Hasher un mot de passe\n */ async function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(password, 12);\n}\n/**\n * Vérifier un mot de passe\n */ async function verifyPassword(password, hashedPassword) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, hashedPassword);\n}\n/**\n * Générer un token aléatoire (pour activation, reset password)\n */ function generateToken() {\n    const chars = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\n    let token = \"\";\n    for(let i = 0; i < 64; i++){\n        token += chars.charAt(Math.floor(Math.random() * chars.length));\n    }\n    return token;\n}\n// =============================================================================\n// Vérification des rôles\n// =============================================================================\n/**\n * Vérifier si l'utilisateur a le rôle requis\n */ function hasRole(userRole, requiredRoles) {\n    return requiredRoles.includes(userRole);\n}\n/**\n * Vérifier si l'utilisateur est admin\n */ function isAdmin(role) {\n    return role === _prisma_client__WEBPACK_IMPORTED_MODULE_3__.Role.ADMIN;\n}\n/**\n * Vérifier si l'utilisateur est gestionnaire ou admin\n */ function isGestionnaireOrAdmin(role) {\n    return role === _prisma_client__WEBPACK_IMPORTED_MODULE_3__.Role.GESTIONNAIRE || role === _prisma_client__WEBPACK_IMPORTED_MODULE_3__.Role.ADMIN;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDK0QsWUFBWSxJQUFJbEMsU0FBUzdCLGdEQUFJQSxDQUFDNkQsS0FBSztBQUMxRCIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhc2YtY2FudGluZS8uL3NyYy9saWIvYXV0aC50cz82NjkyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDb25maWd1cmF0aW9uIE5leHRBdXRoLmpzIGV0IHV0aWxpdGFpcmVzIGQnYXV0aGVudGlmaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdGpzXCI7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiLi9kYlwiO1xuaW1wb3J0IHsgUm9sZSwgQWNjb3VudFN0YXR1cyB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG4vLyBFeHRlbnNpb24gZGVzIHR5cGVzIE5leHRBdXRoIHBvdXIgaW5jbHVyZSBub3MgY2hhbXBzIHBlcnNvbm5hbGlzw6lzXG5kZWNsYXJlIG1vZHVsZSBcIm5leHQtYXV0aFwiIHtcbiAgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIHVzZXI6IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgZmlyc3ROYW1lOiBzdHJpbmc7XG4gICAgICBsYXN0TmFtZTogc3RyaW5nO1xuICAgICAgcm9sZTogUm9sZTtcbiAgICAgIGNhbnRlZW5BY2NvdW50TnVtYmVyOiBzdHJpbmcgfCBudWxsO1xuICAgIH07XG4gIH1cblxuICBpbnRlcmZhY2UgVXNlciB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xuICAgIGxhc3ROYW1lOiBzdHJpbmc7XG4gICAgcm9sZTogUm9sZTtcbiAgICBjYW50ZWVuQWNjb3VudE51bWJlcjogc3RyaW5nIHwgbnVsbDtcbiAgfVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIm5leHQtYXV0aC9qd3RcIiB7XG4gIGludGVyZmFjZSBKV1Qge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbiAgICBmaXJzdE5hbWU6IHN0cmluZztcbiAgICBsYXN0TmFtZTogc3RyaW5nO1xuICAgIHJvbGU6IFJvbGU7XG4gICAgY2FudGVlbkFjY291bnROdW1iZXI6IHN0cmluZyB8IG51bGw7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENvbmZpZ3VyYXRpb24gTmV4dEF1dGhcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBwcm92aWRlcnM6IFtcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6IFwiQ3JlZGVudGlhbHNcIixcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiBcIkVtYWlsXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJNb3QgZGUgcGFzc2VcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbWFpbCBldCBtb3QgZGUgcGFzc2UgcmVxdWlzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVjaGVyY2hlciBsJ3V0aWxpc2F0ZXVyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZTogeyBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwudG9Mb3dlckNhc2UoKSB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbWFpbCBvdSBtb3QgZGUgcGFzc2UgaW5jb3JyZWN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVsOpcmlmaWVyIGxlIHN0YXR1dCBkdSBjb21wdGVcbiAgICAgICAgaWYgKHVzZXIuc3RhdHVzID09PSBBY2NvdW50U3RhdHVzLlBFTkRJTkcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wdGUgZW4gYXR0ZW50ZSBkJ2FjdGl2YXRpb24uIFbDqXJpZmlleiB2b3MgZW1haWxzLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1c2VyLnN0YXR1cyA9PT0gQWNjb3VudFN0YXR1cy5ESVNBQkxFRCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXB0ZSBkw6lzYWN0aXbDqS4gQ29udGFjdGV6IGwnYWRtaW5pc3RyYXRldXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVsOpcmlmaWVyIGxlIG1vdCBkZSBwYXNzZVxuICAgICAgICBpZiAoIXVzZXIucGFzc3dvcmRIYXNoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcHRlIG5vbiBhY3RpdsOpLiBWw6lyaWZpZXogdm9zIGVtYWlscy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhd2FpdCBiY3J5cHQuY29tcGFyZShcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkSGFzaFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghaXNWYWxpZFBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW1haWwgb3UgbW90IGRlIHBhc3NlIGluY29ycmVjdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ldHRyZSDDoCBqb3VyIGxhIGRhdGUgZGUgZGVybmnDqHJlIGNvbm5leGlvblxuICAgICAgICBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xuICAgICAgICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXG4gICAgICAgICAgZGF0YTogeyBsYXN0TG9naW5BdDogbmV3IERhdGUoKSB9LFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIGZpcnN0TmFtZTogdXNlci5maXJzdE5hbWUsXG4gICAgICAgICAgbGFzdE5hbWU6IHVzZXIubGFzdE5hbWUsXG4gICAgICAgICAgcm9sZTogdXNlci5yb2xlLFxuICAgICAgICAgIGNhbnRlZW5BY2NvdW50TnVtYmVyOiB1c2VyLmNhbnRlZW5BY2NvdW50TnVtYmVyLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgY2FsbGJhY2tzOiB7XG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgdG9rZW4uaWQgPSB1c2VyLmlkO1xuICAgICAgICB0b2tlbi5lbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgICAgIHRva2VuLmZpcnN0TmFtZSA9IHVzZXIuZmlyc3ROYW1lO1xuICAgICAgICB0b2tlbi5sYXN0TmFtZSA9IHVzZXIubGFzdE5hbWU7XG4gICAgICAgIHRva2VuLnJvbGUgPSB1c2VyLnJvbGU7XG4gICAgICAgIHRva2VuLmNhbnRlZW5BY2NvdW50TnVtYmVyID0gdXNlci5jYW50ZWVuQWNjb3VudE51bWJlcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBzZXNzaW9uLnVzZXIgPSB7XG4gICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgZW1haWw6IHRva2VuLmVtYWlsLFxuICAgICAgICBmaXJzdE5hbWU6IHRva2VuLmZpcnN0TmFtZSxcbiAgICAgICAgbGFzdE5hbWU6IHRva2VuLmxhc3ROYW1lLFxuICAgICAgICByb2xlOiB0b2tlbi5yb2xlLFxuICAgICAgICBjYW50ZWVuQWNjb3VudE51bWJlcjogdG9rZW4uY2FudGVlbkFjY291bnROdW1iZXIsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfSxcbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46IFwiL2F1dGgvbG9naW5cIixcbiAgICBlcnJvcjogXCIvYXV0aC9sb2dpblwiLFxuICB9LFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6IFwiand0XCIsXG4gICAgbWF4QWdlOiAyNCAqIDYwICogNjAsIC8vIDI0IGhldXJlc1xuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVdGlsaXRhaXJlcyBwb3VyIGxlcyBtb3RzIGRlIHBhc3NlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEhhc2hlciB1biBtb3QgZGUgcGFzc2VcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMik7XG59XG5cbi8qKlxuICogVsOpcmlmaWVyIHVuIG1vdCBkZSBwYXNzZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQoXG4gIHBhc3N3b3JkOiBzdHJpbmcsXG4gIGhhc2hlZFBhc3N3b3JkOiBzdHJpbmdcbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKTtcbn1cblxuLyoqXG4gKiBHw6luw6lyZXIgdW4gdG9rZW4gYWzDqWF0b2lyZSAocG91ciBhY3RpdmF0aW9uLCByZXNldCBwYXNzd29yZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVG9rZW4oKTogc3RyaW5nIHtcbiAgY29uc3QgY2hhcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XG4gIGxldCB0b2tlbiA9IFwiXCI7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgIHRva2VuICs9IGNoYXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFycy5sZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gdG9rZW47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBWw6lyaWZpY2F0aW9uIGRlcyByw7RsZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogVsOpcmlmaWVyIHNpIGwndXRpbGlzYXRldXIgYSBsZSByw7RsZSByZXF1aXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1JvbGUodXNlclJvbGU6IFJvbGUsIHJlcXVpcmVkUm9sZXM6IFJvbGVbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gcmVxdWlyZWRSb2xlcy5pbmNsdWRlcyh1c2VyUm9sZSk7XG59XG5cbi8qKlxuICogVsOpcmlmaWVyIHNpIGwndXRpbGlzYXRldXIgZXN0IGFkbWluXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FkbWluKHJvbGU6IFJvbGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIHJvbGUgPT09IFJvbGUuQURNSU47XG59XG5cbi8qKlxuICogVsOpcmlmaWVyIHNpIGwndXRpbGlzYXRldXIgZXN0IGdlc3Rpb25uYWlyZSBvdSBhZG1pblxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHZXN0aW9ubmFpcmVPckFkbWluKHJvbGU6IFJvbGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIHJvbGUgPT09IFJvbGUuR0VTVElPTk5BSVJFIHx8IHJvbGUgPT09IFJvbGUuQURNSU47XG59XG5cbiJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiYmNyeXB0IiwicHJpc21hIiwiUm9sZSIsIkFjY291bnRTdGF0dXMiLCJhdXRoT3B0aW9ucyIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJFcnJvciIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJ0b0xvd2VyQ2FzZSIsInN0YXR1cyIsIlBFTkRJTkciLCJESVNBQkxFRCIsInBhc3N3b3JkSGFzaCIsImlzVmFsaWRQYXNzd29yZCIsImNvbXBhcmUiLCJ1cGRhdGUiLCJpZCIsImRhdGEiLCJsYXN0TG9naW5BdCIsIkRhdGUiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsInJvbGUiLCJjYW50ZWVuQWNjb3VudE51bWJlciIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwic2Vzc2lvbiIsInBhZ2VzIiwic2lnbkluIiwiZXJyb3IiLCJzdHJhdGVneSIsIm1heEFnZSIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJoYXNoUGFzc3dvcmQiLCJoYXNoIiwidmVyaWZ5UGFzc3dvcmQiLCJoYXNoZWRQYXNzd29yZCIsImdlbmVyYXRlVG9rZW4iLCJjaGFycyIsImkiLCJjaGFyQXQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJoYXNSb2xlIiwidXNlclJvbGUiLCJyZXF1aXJlZFJvbGVzIiwiaW5jbHVkZXMiLCJpc0FkbWluIiwiQURNSU4iLCJpc0dlc3Rpb25uYWlyZU9yQWRtaW4iLCJHRVNUSU9OTkFJUkUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Déclaration pour éviter les multiples instances en développement (hot reload)\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBOEM7QUFFOUMsZ0ZBQWdGO0FBQ2hGLE1BQU1DLGtCQUFrQkM7QUFJakIsTUFBTUMsU0FDWEYsZ0JBQWdCRSxNQUFNLElBQ3RCLElBQUlILHdEQUFZQSxDQUFDO0lBQ2ZJLEtBQ0VDLEtBQXNDLEdBQ2xDO1FBQUM7UUFBUztRQUFTO0tBQU8sR0FDMUIsQ0FBUztBQUNqQixHQUFHO0FBRUwsSUFBSUEsSUFBcUMsRUFBRTtJQUN6Q0osZ0JBQWdCRSxNQUFNLEdBQUdBO0FBQzNCO0FBRUEsaUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYXNmLWNhbnRpbmUvLi9zcmMvbGliL2RiLnRzPzllNGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbi8vIETDqWNsYXJhdGlvbiBwb3VyIMOpdml0ZXIgbGVzIG11bHRpcGxlcyBpbnN0YW5jZXMgZW4gZMOpdmVsb3BwZW1lbnQgKGhvdCByZWxvYWQpXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzpcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCJcbiAgICAgICAgPyBbXCJxdWVyeVwiLCBcImVycm9yXCIsIFwid2FyblwiXVxuICAgICAgICA6IFtcImVycm9yXCJdLFxuICB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7XG5cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fspidersnake%2FDownloads%2FCantine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();