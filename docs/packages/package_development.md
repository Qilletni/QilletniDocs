# Package Development

## Running Examples

When working with packages, it is often useful to run code (such as `examples/`) using the package without building the `.qll` and installing it.
This is possible through the `-l` and `-j` flags of `qilletni run`.

Given the following tree:

```
package_name/
├── examples
│   └── example1.ql
└── qilletni-src/
    ├── package_name.ql
    └── qilletni_info.yml
```

To run the file `examples/example1.ql` with the package installed, run it with the `-l` flag. This specifies the directory of the root of the project, containing `qilletni-src/`. If no path is specified, the current directory will be used.
For example:

```bash
~/package_name$ qilletni run -l examples/example1.ql
```

### Running With A Native Jar

The run command may optionally build the native jar before running, using the `-j` flag. If the above example contained native code, it could be ran with:

```bash
~/package_name$ qilletni run -j -l examples/example1.ql
```

This will auto-detect the Gradle project and build the native jar.
