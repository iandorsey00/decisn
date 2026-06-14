# Daily Ops

Deploy the static site from the Decisn repo:

```bash
export REMOTE_HOST=<server-host-or-alias>
export REMOTE_USER=<ssh-user>
export REMOTE_TARGET_DIR=<static-site-root>
./deploy/deploy-static.sh
```

Optional settings:

```bash
REMOTE_TMP_DIR=/tmp/decisn-static
CADDY_CONFIG=/etc/caddy/Caddyfile
```

Override any value inline when needed:

```bash
REMOTE_HOST=example-host REMOTE_USER=example-user ./deploy/deploy-static.sh
```

The script checks `app.js`, syncs the static files, validates Caddy, and reloads Caddy.
