# AGENTS.md
- Shared shell (Navbar/Footer) lives in src/components/layout and wraps <Outlet /> in __root — one place for site chrome.
- Nav items are defined once in src/config/navigation.ts — navbar and footer stay in sync.
- Unbuilt pages render the shared ComingSoon component — keeps placeholders consistent and clearly non-functional.
