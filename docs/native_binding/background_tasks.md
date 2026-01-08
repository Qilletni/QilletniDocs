# Background Tasks

The Qilletni language itself is strictly single threaded, and does not have plans to become multithreaded. Native methods in Java, however, may call Qilletni code from another thread with the use of background tasks through the [BackgroundTaskExecutor](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/internal/BackgroundTaskExecutor.html). This is useful when a native method is polling an API, waiting for an IPC call or webhook, and then needs to tell Qilletni about it. This also lets Qilletni be useful in a server context.

A background task is broken down into two parts: a **callback** and a **condition**. A callback is a [Runnable](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/lang/Runnable.html) or a [Consumer](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/function/Consumer.html) that is invoked when a condition is triggered. A condition is identified by an ID, and may be triggered in any Java thread. The callback is always ran on the Qilletni thread, which may do normal Qilletni operations, such as invoking a function or modifying a variable.

The following is an example of creating a condition and getting its ID.

```java
// BackgroundTaskExecutor backgroundTaskExecutor; FunctionType callback;  TypeConverter typeConverter;  FunctionInvoker functionInvoker;

final int conditionId = backgroundTaskExecutor.runWhenCondition((String songName) -> {  // (1)!
    List<QilletniType> args = typeConverter.convertToQilletniTypes(List.of(songName));  // (2)!
    functionInvoker.invokeFunction(callback, args);
});
```

1. Everything ran in this method is on the Qilletni thread
2. Create the arguments from a Java list to QilletniType list

The above code tells the BackgroundTaskExecutor to run the given Consumer when returned `conditionId` is triggered. The way to trigger this condition is:

```java
backgroundTaskExecutor.triggerCondition(conditionId, "My Song");
```

In this instance, the Consumer accepted a string. This could be any object, which allows cross-thread parameters. Note that you must do any Qilletni type conversion in the callback.

In Qilletni, a program may complete while a background task is running. To circumvent this, the [`processBackground()`](https://docs.qilletni.dev/library/std/#native+fun+processBackground%28%29) function may be invoked, which stops the program indefinitely, letting background tasks complete. 
