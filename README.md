# base_app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


```
Vue3_Base
├─ eslint.config.js
├─ index.html
├─ jsconfig.json
├─ package.json
├─ public
│  ├─ countrystatecity.xlsx
│  ├─ favicon.ico
│  ├─ img
│  │  ├─ icons
│  │  │  ├─ android-chrome-192x192.png
│  │  │  ├─ android-chrome-512x512.png
│  │  │  ├─ apple-touch-icon.png
│  │  │  ├─ browserconfig.xml
│  │  │  ├─ favicon-16x16.png
│  │  │  ├─ favicon-32x32.png
│  │  │  ├─ favicon.ico
│  │  │  ├─ manifest.json
│  │  │  └─ site.webmanifest
│  │  ├─ sample.pdf
│  │  └─ xlsxicon.png
│  ├─ robots.txt
│  └─ storesexcel.xlsx
├─ README.md
├─ src
│  ├─ Admin
│  │  └─ UserPages
│  │     ├─ ForgotPassword.vue
│  │     ├─ LoginPage.vue
│  │     ├─ NavigateInvitation.vue
│  │     ├─ OtpValidation.vue
│  │     ├─ RegisterUser.vue
│  │     ├─ ResetPassword.vue
│  │     ├─ ResetPasswordForm.vue
│  │     └─ SetPassword.vue
│  ├─ App.vue
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ global.css
│  │  │  ├─ global.css.map
│  │  │  └─ global.scss
│  │  ├─ files
│  │  │  └─ download.docx
│  │  ├─ i18n
│  │  │  ├─ ar.json
│  │  │  ├─ en.json
│  │  │  └─ index.js
│  │  ├─ images
│  │  │  ├─ 563118-200.png
│  │  │  ├─ avatars
│  │  │  │  ├─ default.png
│  │  │  │  └─ default_2.png
│  │  │  ├─ bg.png
│  │  │  ├─ bg1.png
│  │  │  ├─ logo.png
│  │  │  ├─ no_image.png
│  │  │  ├─ upload_image_default.png
│  │  │  └─ upload_image_default_old.png
│  │  ├─ logo.png
│  │  └─ mdi_icons
│  │     └─ icons.json
│  ├─ axios-plugin.js
│  ├─ axios.js
│  ├─ components
│  │  ├─ ConfirmDialog.vue
│  │  ├─ Cruds
│  │  │  ├─ Countries
│  │  │  │  ├─ CitiesAmend.vue
│  │  │  │  ├─ CitiesIndex.vue
│  │  │  │  ├─ CountriesAmend.vue
│  │  │  │  ├─ CountriesIndex.vue
│  │  │  │  ├─ StatesAmend.vue
│  │  │  │  └─ StatesIndex.vue
│  │  │  ├─ Dashboard
│  │  │  │  ├─ MainDashboard.vue
│  │  │  │  └─ TradieDashboard.vue
│  │  │  ├─ EmailTemplates
│  │  │  │  ├─ EmailTemplateAmend.vue
│  │  │  │  └─ EmailTemplateIndex.vue
│  │  │  ├─ Lookups
│  │  │  │  ├─ ChildLookupsAmend.vue
│  │  │  │  ├─ ChildLookupsIndex.vue
│  │  │  │  ├─ LookupsAmend.vue
│  │  │  │  └─ LookupsIndex.vue
│  │  │  ├─ Menus
│  │  │  │  ├─ IndexPage.vue
│  │  │  │  └─ MenuAmend.vue
│  │  │  ├─ Profile
│  │  │  │  ├─ ProfileAmend.vue
│  │  │  │  └─ ViewProfile.vue
│  │  │  ├─ Roles
│  │  │  │  ├─ IndexPage.vue
│  │  │  │  ├─ RolesAmend.vue
│  │  │  │  └─ RolesMenu.vue
│  │  │  ├─ SystemParameter
│  │  │  │  ├─ SystemParameterAmend.vue
│  │  │  │  └─ SystemParameterIndex.vue
│  │  │  └─ Users
│  │  │     ├─ IndexPage.vue
│  │  │     └─ UserAmend.vue
│  │  ├─ CustomComponents
│  │  │  ├─ ComingSoon.vue
│  │  │  ├─ ConfirmDialog.vue
│  │  │  ├─ ContentLoader.vue
│  │  │  ├─ ContentLoaderOld.vue
│  │  │  ├─ CropperDialog.vue
│  │  │  ├─ DatePicker.vue
│  │  │  ├─ DocumentSelect.vue
│  │  │  ├─ ExcelUpload.vue
│  │  │  ├─ FileUpload.vue
│  │  │  ├─ ImageUpload.vue
│  │  │  ├─ ImageUploadSlider.vue
│  │  │  ├─ InsuranceAndClaims.vue
│  │  │  ├─ PageTitle.vue
│  │  │  ├─ PreviewWebapp.vue
│  │  │  ├─ ReviewComments.vue
│  │  │  └─ StoreExcelUpload.vue
│  │  └─ PageNotFound.vue
│  ├─ dateMixin.js
│  ├─ Layout
│  │  ├─ NavigationDrawer.vue
│  │  └─ ProfileView.vue
│  ├─ localStorageWrapper.js
│  ├─ LogoutTimer.vue
│  ├─ main.js
│  ├─ router
│  │  └─ index.js
│  ├─ store
│  │  ├─ apptheme.js
│  │  ├─ index.js
│  │  ├─ modules
│  │  │  └─ Auth
│  │  │     └─ auth.js
│  │  └─ navigation.js
│  └─ views
│     └─ NotFound.vue
└─ vite.config.mjs

```