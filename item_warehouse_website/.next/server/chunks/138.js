exports.id = 138;
exports.ids = [138];
exports.modules = {

/***/ 8168:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 5053))

/***/ }),

/***/ 1426:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 1232, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 2987, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 831, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 6926, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 4282, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 6505, 23))

/***/ }),

/***/ 5053:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Sidebar_client),
  dynamic: () => (/* binding */ dynamic)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(8038);
;// CONCATENATED MODULE: ./app/services/api.ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const getItemsFromWarehouse = async (warehouseName, count, pageNumber)=>{
    const res = await fetch(`${apiBaseUrl}/v1/warehouses/${warehouseName}/items?page_size=${count}&page=${pageNumber || 1}`);
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
};
const getWarehouse = async (warehouseName)=>{
    const res = await fetch(`${apiBaseUrl}/v1/warehouses/${warehouseName}`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
};
const getWarehouses = async ()=>{
    const res = await fetch(`${apiBaseUrl}/v1/warehouses`);
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data.warehouses;
};


// EXTERNAL MODULE: ./app/styles/Sidebar.module.css
var Sidebar_module = __webpack_require__(8685);
var Sidebar_module_default = /*#__PURE__*/__webpack_require__.n(Sidebar_module);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/@mdi/react/Icon.js
var Icon = __webpack_require__(6567);
var Icon_default = /*#__PURE__*/__webpack_require__.n(Icon);
// EXTERNAL MODULE: ./node_modules/@mdi/js/commonjs/mdi.js
var mdi = __webpack_require__(5097);
;// CONCATENATED MODULE: ./app/components/Sidebar.client.tsx
/* __next_internal_client_entry_do_not_use__ default,dynamic auto */ 






const Sidebar = ()=>{
    const [warehouses, setWarehouses] = (0,react_.useState)([]);
    (0,react_.useEffect)(()=>{
        getWarehouses().then((warehouses)=>{
            setWarehouses(warehouses);
        }).catch((error)=>{
            console.error(error);
        });
    }, []);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Sidebar_module_default()).sidebar,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                className: `text-center my-1 fw-bold ${(Sidebar_module_default()).header}`,
                children: "Warehouses"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "list-group",
                children: warehouses.map((warehouse)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        className: "list-group-item text-decoration-none",
                        href: `/warehouse/${encodeURIComponent(warehouse.name)}`,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx((Icon_default()), {
                                className: "me-2",
                                path: mdi/* mdiWarehouse */._MI,
                                size: 1
                            }),
                            warehouse.name
                        ]
                    }, warehouse.name))
            })
        ]
    });
};
/* harmony default export */ const Sidebar_client = (Sidebar);
const dynamic = "force-dynamic";


/***/ }),

/***/ 8685:
/***/ ((module) => {

// Exports
module.exports = {
	"sidebar": "Sidebar_sidebar__qoTN4"
};


/***/ }),

/***/ 9057:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "layout_container__F8gUU",
	"content": "layout_content__Ers_r"
};


/***/ }),

/***/ 4740:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app/layout.tsx","import":"Poppins","arguments":[{"subsets":["latin"],"weight":"300"}],"variableName":"poppins"}
var layout_tsx_import_Poppins_arguments_subsets_latin_weight_300_variableName_poppins_ = __webpack_require__(1269);
var layout_tsx_import_Poppins_arguments_subsets_latin_weight_300_variableName_poppins_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Poppins_arguments_subsets_latin_weight_300_variableName_poppins_);
// EXTERNAL MODULE: ./node_modules/bootstrap/dist/css/bootstrap.min.css
var bootstrap_min = __webpack_require__(7453);
// EXTERNAL MODULE: ./app/styles/globals.css
var globals = __webpack_require__(413);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(1363);
;// CONCATENATED MODULE: ./app/components/Sidebar.client.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/home/runner/work/addon-item-warehouse-website/addon-item-warehouse-website/item_warehouse_website/app/components/Sidebar.client.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const Sidebar_client = (__default__);
const e0 = proxy["dynamic"];

// EXTERNAL MODULE: ./app/styles/layout.module.css
var layout_module = __webpack_require__(9057);
var layout_module_default = /*#__PURE__*/__webpack_require__.n(layout_module);
;// CONCATENATED MODULE: ./app/layout.tsx






const metadata = {
    title: "Item Warehouse",
    description: "A database with an API in front of it."
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ jsx_runtime_.jsx("body", {
            className: (layout_tsx_import_Poppins_arguments_subsets_latin_weight_300_variableName_poppins_default()).className,
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (layout_module_default()).container,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(Sidebar_client, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: (layout_module_default()).content,
                        children: children
                    })
                ]
            })
        })
    });
}


/***/ }),

/***/ 7481:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"16x16"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ }),

/***/ 413:
/***/ (() => {



/***/ })

};
;