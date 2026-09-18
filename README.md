# Static Site Server

Setup a basic linux server and configure it to serve a static site.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation & Usage](#installation--usage)
- [Example Output](#example-output)
- [How It Works](#how-it-works)
- [Error Handling](#error-handling)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## About

This project is a beginner-friendly static website deployment exercise.

It demonstrates how to serve a small website with Nginx on a remote Linux server and how to publish local changes with `rsync` over SSH.

**Project Reference:** [roadmap.sh/projects/static-site-server project](https://roadmap.sh/projects/static-site-server)

## Features

- Static webpage built with HTML, CSS, JavaScript, and an image asset.
- Full-screen image interaction handled by a small JavaScript file.
- Nginx configuration for serving the website from the server IP address.
- Repeatable deployment with `rsync`.

## Project Structure

```text
.
├── website/
│   ├── index.html
│   └── assets/
│       ├── css/style.css
│       ├── images/papillons-au-coucher-du-soleil.jpg
│       └── js/main.js
├── nginx.conf
├── deploy.sh
└── README.md
```

`website/` contains only the files that must be published. The infrastructure and documentation files remain at the project root.

## Requirements

### Local machine

- Git
- OpenSSH client
- `rsync`

### Remote server

- Linux server with a public IP address
- SSH access for the deployment user
- Nginx installed
- Permission to write to `/var/html/roadmap/website`

The official roadmap.sh project also allows using a domain name. This project uses the server IP address and the default Nginx server block.

## Installation & Usage

### 1. Connect to the server

First, verify that SSH access works. Replace the user and IP address with your own values when needed:

```bash
ssh ubuntu@IP_ADDRESS
```

On the server, install Nginx if it is not installed:

```bash
sudo apt update
sudo apt install -y nginx
```

Check that the service is running:

```bash
sudo systemctl enable --now nginx
sudo systemctl status nginx
```

### 2. Prepare the Nginx document root

The repository's [`nginx.conf`](nginx.conf) serves `/var/html/roadmap/website`. Create that directory on the remote server:

```bash
sudo mkdir -p /var/html/roadmap/website
sudo chown -R ubuntu:ubuntu /var/html/roadmap
```

Copy the Nginx configuration to the server from the local project directory:

```bash
scp nginx.conf ubuntu@IP_ADDRESS:/tmp/nginx.conf
```

Install it as an Nginx site configuration:

```bash
sudo cp /tmp/nginx.conf /etc/nginx/sites-available/nginx.conf
sudo ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Run the commands after `scp` in the SSH session on the remote server. `nginx -t` must succeed before reloading Nginx.

### 4. Deploy the website

Make the deployment script executable once:

```bash
chmod +x deploy.sh
```

Run it from the repository root:

```bash
./deploy.sh
```

The script synchronizes `website/` with `/var/html/roadmap/website/` on the remote server.

### 5. Verify the deployment

Open the server address in a browser:

```text
http://IP_ADDRESS
```

You can also check the response headers from your local machine:

```bash
curl -I http://IP_ADDRESS
```

After changing the site, repeat step 4 and refresh the browser.

## Example Output

A successful deployment prints the files transferred by `rsync`, for example:

```text
sending incremental file list
./
index.html
assets/
assets/css/
assets/css/style.css
assets/js/
assets/js/main.js

sent 2,xxx bytes  received xxx bytes  x,xxx.xx bytes/sec
total size is x,xxx  speedup is 1.00
```

A successful Nginx check prints:

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## How It Works

1. `index.html` defines the page structure and references the CSS, JavaScript, and image files inside `website/assets/`.
2. `assets/css/style.css` controls the layout, colors, responsive design, and animations.
3. `assets/js/main.js` opens and closes the full-screen image dialog when the main button is clicked.
4. `deploy.sh` uses SSH through `rsync` to copy the complete `website/` directory to the remote document root.
5. Nginx receives browser requests on port `80`, looks for files under `/var/html/roadmap/website`, and returns them to the browser.

The expected order is therefore: prepare the server, configure Nginx, preview locally, deploy the website, then verify it through the server IP address.

## Error Handling

### `Permission denied` during deployment

Check SSH access and the remote directory permissions:

```bash
ssh ubuntu@IP_ADDRESS
ls -ld /var/html/roadmap/website
```

The remote user must be able to write to the deployment directory.

### `Connection refused` or timeout

Confirm that Nginx is running and that port `80` is allowed by the server firewall:

```bash
sudo systemctl status nginx
sudo ufw allow 80/tcp
```

### Nginx configuration test fails

Run:

```bash
sudo nginx -t
```

Fix the reported file or path before running `sudo systemctl reload nginx`.

## Roadmap

- Add configurable server user, host, and destination variables to `deploy.sh`.
- Add a domain name and HTTPS with Let's Encrypt.
- Add a CI workflow to validate links and deploy automatically.
- Add automated browser checks for the full-screen image interaction.

## Contributing

1. Create a branch for your change.
2. Update the relevant files and test the website locally.
3. Run `git diff --check` and verify the deployment paths.
4. Open a pull request with a clear description of the change.

## Author

**Created by**: Jessica MOUSSOUGAN

**Email**: [jessicamoussougan@gmail.com](mailto:jessicamoussougan@gmail.com)

**GitHub**: [@JescAude18](https://github.com/JescAude18)

## License

No license yet.

This project is currently for personal training and learning.
