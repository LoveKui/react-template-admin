import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@pages": resolve(__dirname, "src", "pages"),
      "@components": resolve(__dirname, "src", "components"),
      "@stores": resolve(__dirname, "src", "stores"),
      "@services": resolve(__dirname, "src", "services"),
      "@utils": resolve(__dirname, "src", "utils"),
    },
  },
  plugins: [react()],
  // 如果你需要在代码中使用Cesium的全局变量，你可以通过vite的define配置将它定义为全局变量
  // define: {
  //   'CESIUM_BASE_URL': JSON.stringify('/lib/Cesium/'),
  // },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // Enable Less JavaScript evaluation
      },
    },
  },

});
