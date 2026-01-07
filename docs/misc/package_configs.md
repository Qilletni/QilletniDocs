# Package Configs

Qilletni offers the ability for libraries and the internal system to store persistent, user-editable key value strings. This is useful for authentication, program settings, etc.

The `qilletni persist` command is used to manage this data from the command line. The format is:

```bash
qilletni persist <libraryName>  [-ar] [<data>...]
```

The package name may either be `internal`, for the Qilletni system itself, or an actual package name, such as `spotify` or `lastfm`. To view all properties of a library, use the `--all` or `-a` flag, such as:

```bash
$ qilletni persist internal --all
| Property       | Value |
| -------------- | ----- |
| eagerMusicLoad | true  |
```

To remove a value, use the `--remove` or `-r` flag, such as:

```bash
$ qilletni persist internal -r eagerMusicLoad
Removing: eagerMusicLoad
```

To set a value, simply do `key=value`. This may be done multiple times in the same command.

```bash
$ qilletni persist internal eagerMusicLoad=true foo=bar
Parameter 'eagerMusicLoad' set to 'true' in package 'internal'.
Parameter 'foo' set to 'bar' in package 'internal'.

$ qilletni persist internal --all
| Property       | Value |
| -------------- | ----- |
| foo            | bar   |
| eagerMusicLoad | true  |
```

Viewing specific values is done by just putting in the key name, without an `=` after. There may be multiple, and also mixed with setting values. If mixed with setting values, the values being viewed will be printed first, and then set.

```bash
$ qilletni persist internal eagerMusicLoad
| Property       | Value |
| -------------- | ----- |
| eagerMusicLoad | true  |
```

## Using In Native Libraries

In a native library, from Java, package configs can be used via a [native injected class](/native_binding/native_bind_factories/#predefined-injectable-classes), injecting the [PackageConfig](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html) class, as shown below.

```java
public class MyLibraryFunctions {
    private final PackageConfig packageConfig;
    
    public MyLibraryFunctions(PackageConfig packageConfig) {
        this.packageConfig = packageConfig;
    }
}
```

To use this, the package config may be accessed via [get(String)](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html#get(java.lang.String)) and [set(String, String)](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html#set(java.lang.String,java.lang.String)). More methods are outlined in the [javadocs](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html). To save the config, you must use the [saveConfig()](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html#saveConfig()) method.

## Using In Qilletni Code

Currently, package configs are only supported at the native level. To get a interact with data, a native method can be made to access or write to it.
