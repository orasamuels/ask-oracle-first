# AGENTS.md
- Shared shell (Navbar/Footer) lives in src/components/layout and wraps <Outlet /> in __root — one place for site chrome.
- Nav items are defined once in src/config/navigation.ts — navbar and footer stay in sync.
- Unbuilt pages render the shared ComingSoon component — keeps placeholders consistent and clearly non-functional.
- Human vs AI authoritative state lives server-side, and only sanitized views reach the browser — answer keys stay private until round completion.
- Until account implementation is authorized, Human vs AI records use an HttpOnly browser capability cookie hashed in the database, with no direct Data API grants — preserves private persistence without adding login.
- Quiz writes use version-checked updates and persist AI pending state before provider calls — duplicate requests cannot change locked answers or run duplicate AI calls.
