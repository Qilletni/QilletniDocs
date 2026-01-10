# Debugging

Debugging in Qilletni is supported, supporting back traces, inspections of scope, and more.

To use debugging functions, it must be enabled through the `debug` property in the [internal package config](/misc/poackage_configs). This can be done via

```
qilletni persist internal debug=true
```

Once that is enabled, [`std:breakpoint.ql`](https://docs.qilletni.dev/library/std/file/breakpoint.ql) may be imported, and when `breakpoint()` is invoked, it will bring up a REPL debug console capable of running Qilletni code.

In this console [`std:debug/debug.ql`](https://docs.qilletni.dev/library/std/file/debug_debug.ql) is automatically imported, which provides functions used for seeing the current state of the program.

## Debugging Example

This is a simple example showing how a breakpoint can be used, with some basic introspection.

This program doesn't do much, but sets a breakpoint in a function.

```qilletni
import "std:breakpoint.ql"

collection castedCol1 = collection(["Lost in Echoes" by "Caskets", "Cremation Party" by "Ithaca"])

print("Directly casted collection:")
print(castedCol1.toVerboseString())

fun testFun(x, col) {
    printf("original x = %d", [x])

    x++
    breakpoint()

    printf("modified x = %d", [x])
}

int a = 10
int b = 20

testFun(a, castedCol1)
```

Once this is ran, the following is what the debug console might look like, running `vars()` to see the variables in all scopes, and `backtrace()` to see the current stack trace of the program.

```text
Directly casted collection:
collection("Lost in Echoes" by "Caskets", "Cremation Party" by "Ithaca")
original x = 10
filename.ql:12:0  > breakpoint()
>> vars()

Scope fun vars (id: 26) (current)
   - No variables in scope -
    Scope file local (id: 25)
     - No variables in scope -
      Scope global (id: 0)
      a: 11
      b: 20
      castedCol1: collection(list-expression)

Scope file local (id: 16)
   - No variables in scope -
    Scope global (id: 0) (already printed)

Scope fun testFun (id: 20)
  col: collection(list-expression)
  x: 11
    Scope file local (id: 16) (already printed)

Scope file local (id: 25)
  Scope file local (id: 25) (already printed)
>> backtrace()
Stack trace:
        at [lib] breakpoint(..) debug_test.ql:12:4
        at [lib] testFun(..) debug_test.ql:20:0
>> continue
modified x = 11
```

The output is relatively low-level, showing how Qilletni sees the scope and variables internally. Variable names are highlighted in the console for better viewing in large programs.

!!! info

    The REPL is relatively basic at the moment, so it's best to stick with the functions in `debug.ql`

