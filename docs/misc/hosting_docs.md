# Hosting Docs

Qilletni may generate docs for a package in a stateful way, allowing for cross-package references for extension methods. For instance, if you have package A with an entity, and package B has an extension method on that entity, when you generate docs, it will update the docs for package A to show the extension method, making it easier to see what functions are available for each type.

Because of this, a stateful cache of the parsed packages is needed. When a package's docs are generated, the internal structure of each file is cached, so the system can easily add extension methods on cross-referenced types.

The following is a guide on setting up a server to host the docs on. Doc generation is kicked off from a GitHub Actions runner. On the server when docs are being generated, first the latest Qilletni toolchain is pulled down, and then the library's repository is cloned. All generation occurs in a docker container. Note that docs may also be generated locally, without the need of a server.

## Setting Up The Server

The below commands should be ran on a server. This creates a user, and sets up access so GitHub Actions can kick off the doc generation process.

First, create the user:

```bash
sudo adduser --disabled-password --gecos "" github-deploy
sudo usermod -aG docker github-deploy
sudo usermod -aG qilletni github-deploy
```

Then, create the ssh key for authentication.

```bash
sudo mkdir -p /home/github-deploy/.ssh
sudo chown github-deploy:github-deploy /home/github-deploy/.ssh
sudo chmod 700 /home/github-deploy/.ssh
```

```bash
sudo -u github-deploy ssh-keygen -t ed25519 -f /home/github-deploy/.ssh/deploy_key -N ""
```

Lock down the user to only run a script `run_docs_wrapper.sh` which will be created later.

```bash
sudo bash -c 'cat <<EOF > /home/github-deploy/.ssh/authorized_keys
command="/usr/bin/sudo /opt/qilletni/run_docs_wrapper.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty $(cat /home/github-deploy/.ssh/deploy_key.pub)
EOF'
```

Set the permissions of the authorized keys file.

```bash
sudo chown github-deploy:github-deploy /home/github-deploy/.ssh/authorized_keys
sudo chmod 600 /home/github-deploy/.ssh/authorized_keys
```

Allow root access on the script.

```bash
sudo bash -c 'echo "github-deploy ALL=(root) NOPASSWD: /opt/qilletni/run_docs_wrapper.sh" >> /etc/sudoers.d/github-deploy'
```

Now the `github-deploy` user can only run the script that generates the docs. To get these scripts, copy the [QilletniToolchain/deploy](https://github.com/Qilletni/QilletniToolchain/tree/master/deploy) directory contents to the server's `/opt/qilletni` directory, and run

```bash
sudo chmod 2775 /opt/qilletni/
sudo chown -R :qilletni /opt/qilletni/
```

Lastly, in the `run_docs.sh` file downloaded, change the `SERVE_PATH` variable at the top to the root destination of all generated docs' static HTML, such as

```bash
SERVE_PATH="/srv/docker/nginx"
```

To specify the names of documentable libraries, edit the `allowed_releases.json` file. The format is shown below.

```json
{
  "releases": [
    { "name": "std", "repo": "RubbaBoy/Qilletni", "qilletni-src": "qilletni-std-lib/qilletni-src" }
  ]
}
```

The `name` is the library name, the `repo` is the GitHub account/repo name to the source to download, the `qilletni-src` is the path relative to the repository to grab the sources from. This is useful if a GitHub repository contains multiple libraries in it. Only libraries added may be documented from GitHub Actions.

Required but not covered here is a webserver to host the generated static files, such as nginx.

## Setting Up GitHub Actions

To generate docs through a GitHub Action, a step must be added to your workflow to run an SSH command of a library name. The command is just the library name, as it is passed in as a parameter to `run_docs_wrapper.sh`. The following is a simple workflow to document the `spotify` library, ran when manually executed.

```yaml
name: Generate Docs For Library

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Server Deployment via SSH
        uses: appleboy/ssh-action@v0.1.8
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          # The command here is simply the library name.
          # The forced command in authorized_keys will override the command and
          # invoke /usr/bin/sudo /opt/qilletni/run_docs_wrapper.sh, which reads
          # SSH_ORIGINAL_COMMAND. In this case, SSH_ORIGINAL_COMMAND will be the library name.
          script: "spotify"

```

Then, set env secrets for the action:

```
SERVER_HOST = your_ip
SERVER_USER = github-deploy
SERVER_KEY = contents of /home/github-deploy/.ssh/deploy_key
```

From here, once the workflow is triggered, the docs will be pulled down and generated.
