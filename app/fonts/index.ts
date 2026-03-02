import localFont from "next/font/local";

const geistSans = localFont({
  src: [
    {
      path: "./Geist/static/Geist-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "./Geist_Mono/static/GeistMono-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

const inter = localFont({
  src: [
    {
      path: "./Inter/static/Inter_24pt-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./Inter/static/Inter_24pt-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
});

export { geistMono, geistSans, inter };
