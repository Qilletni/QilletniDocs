# Package Management

Package management in Qilletni is handled via the Qilletni Package Manager (QPM). QPM is a serverless package manager using Cloudflare Workers, using GitHub for authentication.

QPM is used via the `qpm` command, installed in the Docker container and the normal system install.

## Package Structure

Packages consist of a scope, name, and version. The scope is either the name or organization the publisher has access to, granted by the authorization through GitHub. To set a scope, set the project's name to `<scope>/<project name>`. For an example, see the [Full Publishing Example](#Full-Publishing-Example).

A package version is in the format of `x.y.z`, with an optional `-SNAPSHOT` trailing the version. A non-snapshot release does not change once published (unless deleted). Snapshots may be re-published, with the `.qll` file replacing the old one every time. 

### Lock Files

A lock file, `qilletni.lock`, is created in the project when a project is installed. This keeps track of all dependencies and subdependencies. When a project is installed, snapshot versions are always re-pulled from the server.

## Usage

To install packages in a fresh project, first enter the project's root (or the `qilletni_src`) directory. Then, run

```bash
qpm install
```

This will scan dependencies in the `qilletni_info.yml`, create a lock file, and download dependencies in `~/.qilletni/packages`

To publish a `.qll`, you must first be logged in via `qpm login`, and follow the prompts, such as:

```txt
$ qpm login
Initiating GitHub authentication...

Please visit: https://github.com/login/device
And enter code: 46A3-BF96

Waiting for authentication...
✓ Authenticated as: RubbaBoy
```

From here, you may now manage and upload your own packages. To publish a `.qll` file, use `qpm publish`:

```bash
qpm publish somelib-1.0.0.qll
```

### Full Publishing Example

The following is an example of creating, building and publishing a package. This creates a package named `publish-demo` with the scope of `RubbaBoy`.

```txt
$ qilletni init --type library --name RubbaBoy/publish-demo
Lock file not found, resolving dependencies...
Resolving dependencies for RubbaBoy/publish-demo...
✓ Lock file created with 1 packages
Installing 1 packages...

✓ qilletni/std@1.0.0 (already installed)

✓ Installation complete!
Installed 1 package(s)
$ cd publish-demo/
$ qilletni build
Built library to build/ql-build/publish-demo-1.0.0.qll
$ qpm publish
Reading package: .
Package: RubbaBoy/publish-demo v1.0.0
Uploading package...
✓ Package published successfully!
Name: @rubbaboy/publish-demo
Version: 1.0.0
Size: 643 B
Integrity: sha256-tUSJ1H4ixx9sVht+3WQHCMqv57tJrt4X+ubyM92WqS0=
adam@adam-pc:/e/QilletniLibraries/publish-demo$ 
```

## Publishing With GitHub Actions

Publishing packages through CI/CD is also possible with the Qilletni Docker image. See the example below for a working workflow file that publishes to QPM on every release tagged `vX.Y.Z`.

```yaml title="publish_qpm.yml"
on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/qilletni/qilletni:snapshot

    steps:
      - uses: actions/checkout@v6

      - name: Build Package
        run: qilletni build

      - name: QPM Publish
        run: qpm publish
        env:
          QPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Note that the `qilletni build` is shorthand for `qilletni build .`, which builds the package that is in the current directory (the repository's root), and `qpm publish` finds the latest `.qll` file in the current project's build directory.
