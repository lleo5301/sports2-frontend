---
sidebar_position: 1
---

# Roles & Permissions

Sports2 uses **roles** and **permissions** to control what each user can see and do.

---

## Roles

| Role | Access |
|------|--------|
| **Super Admin** | Full access including user management and admin endpoints. |
| **Head Coach** | Full access to team features and branding. Cannot manage other super admins. |
| **Assistant Coach** | Players, schedules, reports. Access to depth chart, schedule edit, and team settings may be limited. |
| **Staff** | Day-to-day operations such as roster updates, contacts, and data entry. |

---

## Common Permissions

| Permission | Description |
|------------|-------------|
| `depth_chart_view` | View depth charts. |
| `depth_chart_create` | Create new depth charts. |
| `depth_chart_edit` | Edit existing depth charts. |
| `depth_chart_delete` | Delete depth charts. |
| `schedule_view` | View schedules. |
| `schedule_create` | Create schedules. |
| `schedule_edit` | Edit schedules. |
| `schedule_delete` | Delete schedules. |
| `reports_view` | View scouting and other reports. |
| `reports_create` | Create reports. |
| `reports_edit` | Edit reports. |
| `reports_delete` | Delete reports. |
| `team_settings` | Change team settings and branding. |
| `user_management` | Invite and manage users. |
| `player_assign` | Assign players to rosters or depth charts. |
| `player_unassign` | Unassign players. |

---

## How It Works

- Menu items and buttons are hidden or disabled when you lack the required permission.
- Contact your head coach or administrator if you need access to a feature.
