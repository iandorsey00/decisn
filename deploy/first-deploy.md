# First Deploy

Target domain:

```text
decisn.iandorsey.com
```

Target static directory:

```text
/var/www/decisn
```

## 1. DNS

Create a DNS record for the domain:

```text
Type: A
Name: decisn
Value: <server IPv4 address>
```

If the server has IPv6, also add:

```text
Type: AAAA
Name: decisn
Value: <server IPv6 address>
```

Wait for DNS to resolve:

```bash
dig decisn.iandorsey.com
```

## 2. Prepare Files Locally

From the repository root:

```bash
node --check app.js
```

Optional local preview:

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/?q=salad,sushi,soup&lang=zh
```

## 3. Upload Static Files

Set the remote target:

```bash
export REMOTE_HOST=<server-host-or-ip>
export REMOTE_USER=<ssh-user>
```

Create the remote directory:

```bash
ssh "$REMOTE_USER@$REMOTE_HOST" 'sudo mkdir -p /var/www/decisn && sudo chown -R "$USER":"$USER" /var/www/decisn'
```

Upload the static app:

```bash
rsync -av --delete \
  index.html \
  app.js \
  styles.css \
  manifest.webmanifest \
  LICENSE \
  assets/ \
  "$REMOTE_USER@$REMOTE_HOST:/var/www/decisn/"
```

If your SSH user should not own `/var/www/decisn` permanently, reset ownership after upload:

```bash
ssh "$REMOTE_USER@$REMOTE_HOST" 'sudo chown -R root:root /var/www/decisn'
```

## 4. Caddy

Copy the site block from:

```text
deploy/Caddyfile.decisn
```

Add it to the server Caddy config, usually:

```text
/etc/caddy/Caddyfile
```

Example append:

```bash
cat deploy/Caddyfile.decisn
```

Then on the server, validate and reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy will request and renew the TLS certificate automatically once DNS points at the server.

## 5. Verify

Check the site:

```text
https://decisn.iandorsey.com/
```

Check query loading:

```text
https://decisn.iandorsey.com/?q=salad,sushi,soup&lang=zh
```

Manual UI checks:

- language selector in Options
- comma, Chinese comma, and line-break parsing
- numeric weights
- percent weights
- wheel weighted regions
- slot reel selection
- copy link
- download result image
- history persistence after reload
- clear history
- light, dark, and system theme
- accent color selection

## 6. Rollback

Rollback is static-file replacement.

Options:

- redeploy a previous Git commit
- restore a server-side copy of `/var/www/decisn`
- temporarily point Caddy root back to a backup directory

After changing Caddy config:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
