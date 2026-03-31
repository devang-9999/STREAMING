/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./global.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

// "use client";

// import "./global.css";
// import { Provider } from "react-redux";
// import { store, persistor } from "@/store/store";
// import { PersistGate } from "redux-persist/integration/react";
// import AuthWrapper from "@/components/authWrapper";

// export default function RootLayout({ children }: any) {
//   return (
//     <html>
//       <body>
//         <Provider store={store}>
//           <PersistGate loading={null} persistor={persistor}>
//             <AuthWrapper>{children}</AuthWrapper>
//           </PersistGate>
//         </Provider>
//       </body>
//     </html>
//   );
// }