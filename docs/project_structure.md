# Project Structure

Explore the types of projects, and how to organize files

---

## Types of Projects

With the Qilletni command, you can initialize two types of projects: an **application** and a **library**. An application is a standalone project that can be run, while a library is designed to be packaged and imported into other projects.

A library may also be ran as an application is, but it is not the primary use case.

To create the different types of projects, the following option in the qilletni command is used:

```bash
qilletni init -t <type>
```

Where `<type>` is either `application` or `library`. By default, it is set to `application`.

Below are the structure and differences of each type of project. The first two sections will cover projects without native bindings, while the last section will cover projects with native bindings.

### Applications

To create an application, navigate to your desired directory and run the following command:

```bash
qilletni init <project_name>
```

The resulting project structure will be as follows:

```txt
project_name/
└── qilletni-src/
    ├── project_name.ql
    └── qilletni_info.yml
```

Where `project_name.ql` is the initial source file for the project. All source files should be added to `qilletni-src/`.

### Libraries

To create a library, navigate to your desired directory and run the following command:

```bash
qilletni init -t library <project_name>
```

The resulting project structure will be as follows:

```txt
project_name/
├── examples
│   └── example1.ql
└── qilletni-src/
    ├── project_name.ql
    └── qilletni_info.yml
```

In the example project, `example.ql` is an application file that uses the current library. Its contents will look something like:

```qilletni
import "project_name:project_name.ql"

// Say hello from the sample function
sayHello()
```

This file is not actually part of the project, so it is not included in the `qilletni-src/` directory. Examples of a library are conventionally stored in this directory, or its subdirectories.
To run examples in this directory, see [package development](/packages/package_development).

The example source file for this will contain:

```qilletni
fun sayHello() {
    print("Hello, World!")
}
```

Which defines a simple method an application importing it may use.

### Project With Native Bindings

A project with native bindings is a project that has Java code bound to Qilletni [native methods](native_binding/native_functions.md). To create a project with native bindings, use the `--native-class` option in the `qilletni init` command:

```bash
qilletni init --native-class com.example.qilletni.ProjectName <project_name>
```

The given class name is the class to initially create a project with. This may be changed or removed later. The resulting structure looks like:

```txt
project_name
├── build.gradle
├── gradle.bat
├── gradlew
├── settings.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── qilletni-src
│   ├── project_name.ql
│   └── qilletni_info.yml
└── src
    └── main
        └── java
            └── com
                └── example
                    └── ProjectName.java
```

A Qilletni project with native bindings uses the Gradle build system to compile the project. The `ProjectName.java` file is the initial native binding class, and more Java source files may be added in `src/main/java`.

## File Types

Qilletni includes several different kind of files that can be used in a project. Below are the types of files and their purposes.

### Source Files `.ql`

A .ql` file is a Qilletni source file. It contains the code that will be interpreted by the Qilletni runtime. They may import other source files, or stay standalone.

### `qilletni_info.yml`

The `qilletni_info.yml` file is a configuration file for the project. It contains metadata about the project, with available properties outlined below. It is used by the Qilletni runtime to display information about the project. When a library is packaged, it is parsed into a `qll.info` file.

The available properties are:


| Property Name       | Required | Value Type             | Description                                                  |
| ------------------- | -------- | ---------------------- | ------------------------------------------------------------ |
| name                | yes      | string                 | The name of the project, typically snake_case                |
| version             | yes      | string                 | The x.y.z version                                            |
| author              | yes      | string                 | The author's name                                            |
| description         | no       | string                 | A description of the library                                 |
| dependencies        | no       | package list           | A list of packages the library or application depends on     |
| provider            | no       | Java class string      | The Java class that implements the `ServiceProvider` interface, if the library includes a [service provider](language/service_providers.md) |
| native_bind_factory | no       | Java class string      | The Java class that implements `NativeFunctionBindingFactory` to provide native methods' implementations with singleton instances of objects. See [Native Binding Factories](native_binding/native_bind_factories.md) |
| native_classes      | no       | Java class string list | A list of Java classes that bind to Qilletni native methods. See [Native Methods](native_binding/native_functions.md) |
| auto_import         | no       | source file list       | A list of Qilletni source file paths that are included in all files without an explicit `import`. **Note: This should only be used in rare cases** |

The following is an example of all the properties being used:

```yaml title="qilletni_info.yml"
name: spotify
version: 1.0.0
author: Adam Yarris
description: A service provider that adds support for Spotify
dependencies:
  - 1.0.0:postgres
provider: dev.qilletni.music.spotify.provider.SpotifyServiceProvider
native_bind_factory: dev.qilletni.lib.spotify.SpotifyNativeFunctionBindingFactory
native_classes:
  - dev.qilletni.lib.spotify.PlayRedirect
  - dev.qilletni.lib.spotify.PlaylistToolsFunctions
auto_import:
  - core.ql
```

#### dependencies

The format for dependencies is

// TODO
