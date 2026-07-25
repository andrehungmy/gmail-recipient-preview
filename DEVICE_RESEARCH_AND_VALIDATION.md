# Gmail Recipient Preview — Device Research and Validation

Last reviewed: 2026-07-25

## Reference presets

The preview uses stable reference viewports to make device differences understandable to non-technical users. These values preserve the official screen aspect ratio, but they are not a promise that every operating-system setting produces the same CSS or Android `dp` viewport.

| Preset | Official display specification | Preview reference viewport | Basis |
|---|---:|---:|---|
| iPhone 16 | 2556 × 1179 px, 6.1 in | 393 × 852 | Existing 3× logical reference |
| iPhone 17 | 2622 × 1206 px, 6.3 in | 402 × 874 | Official pixels divided by the standard 3× iPhone scale |
| iPhone 17 Pro | 2622 × 1206 px, 6.3 in | 402 × 874 | Official pixels divided by the standard 3× iPhone scale |
| iPhone 17 Pro Max | 2868 × 1320 px, 6.9 in | 440 × 956 | Official pixels divided by the standard 3× iPhone scale |
| Pixel 9 | Existing project reference | 412 × 925 | Existing aspect-matched reference |
| Samsung Galaxy A07 | 1600 × 720 px, 6.7 in | 360 × 800 | 2× aspect-matched reference |
| Samsung Galaxy A17 | 2340 × 1080 px, 6.7 in | 393 × 851 | Aspect-matched reference; Android `dp` varies with display-size and density settings |

Official sources:

- [Apple — iPhone 17 Technical Specifications](https://www.apple.com/iphone-17/specs/)
- [Apple — iPhone 17 Pro and iPhone 17 Pro Max Technical Specifications](https://www.apple.com/iphone-17-pro/specs/)
- [Samsung — Galaxy A07 specifications](https://www.samsung.com/ar/smartphones/galaxy-a/galaxy-a07-black-128gb-sm-a075mzkearo/)
- [Samsung — Galaxy A17 5G specifications](https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a17-5g-blue-128gb-sm-a176bzbaeub/)

## Gmail chrome reference

The Extension now distinguishes three representative surfaces:

- iOS Gmail App: iOS status chrome, Dynamic Island, Gmail mobile message actions, subject metadata, sender actions, fixed reply/forward controls, and Home indicator.
- Android Gmail App: Android status chrome, model-specific camera cutout, Gmail mobile message actions, subject metadata, sender actions, fixed reply/forward controls, and gesture navigation.
- Gmail Web: desktop Gmail message toolbar without mobile system chrome or a mobile reply dock.

Toolbar contents can vary by Gmail release, account type, experiment, and enabled features. The preview therefore models the current recognizable hierarchy and spacing; it does not claim to reproduce every account-specific icon.

Official Gmail references:

- [Google — Learn more about the new layout in Gmail](https://support.google.com/mail/answer/2473038?hl=en)
- [Google — Archive Gmail messages on Android](https://support.google.com/mail/answer/6576?co=GENIE.Platform%3DAndroid&hl=en)
- [Google — Mark messages as read or unread on Android](https://support.google.com/mail/answer/12516?co=GENIE.Platform%3DAndroid&hl=en)

## Native comparison protocol

### Android Gmail App

Use Android Studio Emulator as the primary repeatable environment. Create an Android Virtual Device with a Google Play system image, update Gmail through Google Play, and keep Display size and text at their defaults. BlueStacks may be used as a secondary smoke-test surface, but it should not be the reference environment because its device profiles and system modifications are less deterministic.

Official emulator references:

- [Android Developers — Create and manage virtual devices](https://developer.android.com/studio/run/managing-avds)
- [Android Developers — Install and add files to the emulator](https://developer.android.com/studio/run/emulator-install-add-files)

### iOS Gmail App

Use a physical iPhone or a real-device cloud. Xcode Simulator cannot install the App Store build of Gmail and therefore cannot validate native Gmail App rendering. It can still be used to compare Gmail mobile web in Safari, with the result explicitly labeled as mobile web.

Official simulator references:

- [Apple — Installing your app in many Simulator platforms and versions](https://developer.apple.com/documentation/xcode/installing-your-app-in-many-simulator-platforms-and-versions)
- [Apple Developer Forums — App Store apps cannot run in Simulator](https://developer.apple.com/forums/thread/20257)

## Comparison fixtures

Use the same sent email for every surface:

1. Plain text with manual line breaks.
2. Long copy that exceeds one device screen.
3. Rich text with headings, bold, lists, links, and signature.
4. A 640 × 320 inline image followed by long copy.
5. White, faint, and unusually small text for risk detection.
6. A long URL and an intentionally oversized table or image.

For every capture, record the device or emulator profile, OS version, Gmail version, account type, Light/Dark theme, display size, text size, and timestamp. Compare content width, line wrapping, vertical rhythm, image fit, scroll order, and major fixed-bar placement. Treat icon availability and minor native animation differences as documented variance rather than rendering failures.
