# Page snapshot

```yaml
- link "Back to login":
  - /url: /login
  - img
  - text: Back to login
- heading "Create your account" [level=2]
- paragraph: Join the Collegiate Baseball Scouting Platform
- text: First Name
- textbox "First Name": John
- text: Last Name
- textbox "Last Name": Doe
- text: Email address
- textbox "Email address": john@example.com
- text: Phone Number (Optional)
- textbox "Phone Number (Optional)": 555-0123
- text: Role
- combobox "Role":
  - option "Select your role" [selected]
  - option "Head Coach"
  - option "Assistant Coach"
- text: Password
- textbox "Password"
- button:
  - img
- text: Confirm Password
- textbox "Confirm Password"
- button:
  - img
- button "Create Account"
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /login
```