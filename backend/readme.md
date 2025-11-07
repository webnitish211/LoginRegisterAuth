

# ======= Cron expression format =======

A cron expression has 5 fields (for node-cron):

┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday = 0)
│ │ │ │ │
│ │ │ │ │
* * * * *


# =======Meaning of "0 0 1 * *" =========

| Field        | Value | Meaning                     |
| ------------ | ----- | --------------------------- |
| Minute       | `0`   | at minute 0                 |
| Hour         | `0`   | at hour 0 (midnight)        |
| Day of month | `1`   | on the 1st day of the month |
| Month        | `*`   | every month                 |
| Day of week  | `*`   | every day of the week       |


# ======= calculates the token expiration time in hours =========

Divides the value by 3,600,000, which is the number of milliseconds in 1 hour:
1000 ms × 60 s × 60 min = 3600000 ms
This converts the value from milliseconds → hours.
Examples:

3600000 / 3600000 // 1 hour
7200000 / 3600000 // 2 hours

**Example Scenarios:**

| RESET_TOKEN_EXPIRE | Result (hours) |
| ------------------ | -------------- |
| `'7200000'`        | 2              |
| `undefined`        | 1              |
| `'1800000'`        | 0.5            |
