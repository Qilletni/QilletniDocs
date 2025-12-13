# Getting Started with Qilletni

Welcome to **Qilletni**, a Domain-Specific Language (DSL) designed for advanced playlist management, music curation, and seamless integration with Spotify and Java libraries.

---

## Introduction

Qilletni simplifies the creation and manipulation of playlists and music data, allowing you to automate tasks, integrate with external libraries, and leverage a rich standard library.
If you’d like a broader overview of Qilletni, see the [Home](../index.md) page for more details.

---

## Installation

### Start Database

Qilletni leverages a database for caching music data for efficient lookups and conversions. The easiest way to start a caching database is via docker, using a command such as:

```bash
docker run -d \
  --name qilletni-db \
  -p 5435:5432 \
  -e POSTGRES_USER=qilletni \
  -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=qilletni \
  -v ~/.qilletni/cache:/var/lib/postgresql/data \
  postgres
```

### Install Qilletni

There are two ways to use Qilletni. You may install it on your system, or use the Docker image. A normal system install is recommended (everything is put under `~/.qilletni`), but a Docker install is great for trying things out.

#### Install on System

For a system install, first install you have at least Java 22 installed. To install Qilletni, run the following in a bash shell:

```bash
curl -L https://install.qilletni.dev/ | bash
```

This will install the commands `qilletni` and `qpm`, which are the primary toolchain, and the Qilletni Package Manager (QPM) respectively.

Then, open a new shell or run `source ~/.bashrc`

From there, you can run `qilletni --help` or `qpm --help` for a list of commands.

#### Use with Docker

To use with Docker, run the following:

```bash
docker run --rm \
  --network host \
  -v "/$(pwd)":/workspace \
  -v qilletni-packages:/root/.qilletni/packages \
  ghcr.io/qilletni/qilletni:latest \
  qilletni --help
```

Which is equivalent to running `qilletni --help`. QPM is also accessible through this image.

To run a file, it's recommended to `cd` into the parent directory of the file and run it from there. For example, to run `/e/qilletni/demo.ql` you would do, from the `/e/qilletni` directory,

```bash
docker run --rm \
  --network host \
  -v "/$(pwd)":/workspace \
  -v qilletni-packages:/root/.qilletni/packages \
  ghcr.io/qilletni/qilletni:latest \
  run demo.ql
```

---

## Hello World (Your First Program)

Let’s create a simple "Hello, World!" program:

1. **Initialize a project** Create a project directory, and then run the command

```bash
qilletni init --name qilletni_demo
```

It will ask you for a project name, and the author's name. In this case, we'll give it the name `qilletni_demo`. It will also ask for an optional native binding class name, which may be left blank for now.

This will create a file tree of the following structure:

```txt
qilletni_demo/
└── qilletni-src/
    ├── qilletni_demo.ql
    ├── qilletni.lock
    └── qilletni_info.yml
```

The file created, `qilletni_demo.ql`, is the start of your source code. Right now, it only contains:

```qilletni title="qilletni_demo.ql"
print("Hello, World!")
```

A more in-depth explanation of the project structure, and other project types, can be found in the [Project Structure](../project_structure.md) guide.

2. **Run** the program via command line:

```bash
qilletni run qilletni-src/qilletni_demo.ql
```

If everything is set up correctly, you should see:

```
Hello, World!
```

## Next Steps

Now that you have a Qilletni program running, it's time to link a music service. Check out the [Spotify](spotify_integration) or [Last.fm](lastfm_integration) pages for more info. If you've done that, feel tree to check out the [Language Introduction](/language/introduction) or some of the [official packages](/packages/introduction).

For making and using packages in Qilletni, navigate to [Package Management](/packages/package_managment).
