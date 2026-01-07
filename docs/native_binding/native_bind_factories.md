# Native Bind Factories

Native bind factories are used to add instances of a class to the system to allow it to be injected into the constructor that contains a native method.

The following is an example of using injected instances:

```java
public class MyLibraryFunctions {
    
    private final EntityInitializer entityInitializer;
    private final SongTypeFactory songTypeFactory;

    public MyLibraryFunctions(EntityInitializer entityInitializer, SongTypeFactory songTypeFactory) {
    	this.entityInitializer = entityInitializer;
		this.songTypeFactory = songTypeFactory;
    }
}
```

The order of the parameters don't matter, nor do they necessarily need to be set to a class member variable, but it is recommended to. It is not recommended to execute code in the constructor, that should be reserved for methods annotated with [@BeforeAnyInvocation](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lib/annotations/BeforeAnyInvocation.html) as outlined [here](/native_binding/native_functions/#preload-methods).

## Predefined Injectable Classes

Below is a list of all classes that are injectable by default, with a brief description of their purpose.

| Class                                                        | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [MusicPopulator](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/MusicPopulator.html) | Often ran in a [@BeforeAnyInvocation](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/annotations/BeforeAnyInvocation.html) method, this force-populates a given music type with its service provider data, as lazy loading of types may allow there to be no lookup of the type yet |
| [EntityDefinitionManager](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/entity/EntityDefinitionManager.html) | Handles lookups and defining entities                        |
| [EntityInitializer](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/entity/EntityInitializer.html) | Initializes entities by name or definition with constructor args, supporting auto-conversion of types |
| [ListInitializer](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/list/ListInitializer.html) | Creates [ListType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/ListType.html)s from values, either Qilletni or Java. |
| [SongTypeFactory](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/factories/SongTypeFactory.html) | Creates a [SongType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/SongType.html) from a [Track](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/Track.html) |
| [CollectionTypeFactory](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/factories/CollectionTypeFactory.html) | Creates a [CollectionType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/CollectionType.html) from a [Playlist](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/Playlist.html) |
| [AlbumTypeFactory](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/factories/AlbumTypeFactory.html) | Creates an [AlbumType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/AlbumType.html) from an [Album](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/Album.html) |
| [FunctionInvoker](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/internal/FunctionInvoker.html) | Invokes a Qilletni function, allowing for callbacks          |
| [TypeConverter](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/conversion/TypeConverter.html) | Converts Qilletni types to Java types and back               |
| [DynamicProvider](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/music/supplier/DynamicProvider.html) | Manages the current service provider, with getters for internal |
| [PackageConfig](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/persistence/PackageConfig.html) | A scoped instance (see section below) of the current library's config |
| [BackgroundTaskExecutor](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/internal/BackgroundTaskExecutor.html) | Allow for async Qilletni callbacks, outlined in the [Background Tasks](/native_binding/background_tasks) page |

## Adding Custom Injectable Classes

Sometimes, you have your own factories or other classes that you want injected into classes with native methods. To do this, first you must implement the [NativeFunctionBindingFactory](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/NativeFunctionBindingFactory.html) class. Then, add it to the qilletni_info.yml file, such as:

```yml title="qilletni_info.yml"
# ...
native_bind_factory: dev.qilletni.lib.spotify.SpotifyNativeFunctionBindingFactory
```

The implementation of this interface may look something like this:

```java title="SpotifyNativeFunctionBindingFactory"
public class SpotifyNativeFunctionBindingFactory implements NativeFunctionBindingFactory {

    @Override
    public void applyNativeFunctionBindings(NativeFunctionClassInjector nativeFunctionClassInjector) {
        nativeFunctionClassInjector.addInjectableInstance(new PlaylistCreator(SpotifyApiSingleton.getSpotifyAuthorizer()));
    }
}
```

This will now allow the spotify library's class, `PlaylistCreator` to be used in classes containing native methods, such as:

```java title="PlaylistToolsFunctions.java"
public class PlaylistToolsFunctions {
    private final PlaylistCreator playlistCreator;

    public PlaylistToolsFunctions(PlaylistCreator playlistCreator) {
        this.playlistCreator = playlistCreator;
    }
}
```

### Scoped Injectable Classes

Not all injectable instances may need to be injected into all classes. Qilletni offers the ability to scope the injectable classes via class name, allowing more restricted access to them. This also lets you have multiple native method classes taking in different instances of the same class or interface. Below is an example of setting a scoped injectable class, and two classes trying to use it.

```java title="CatNativeFunctionsBindingFactory.java"
public class CatNativeFunctionsBindingFactory implements NativeFunctionBindingFactory {

    @Override
    public void applyNativeFunctionBindings(NativeFunctionClassInjector nativeFunctionClassInjector) {
        nativeFunctionClassInjector.addScopedInjectableInstance(new CatSitter(), List.of(CatFunctions.class));
    }
}
```

```java title="CatFunctions.java"
public class CatFunctions {
    private final CatSitter catSitter;
    
    public CatFunctions(CatSitter catSitter) {  // Works
        this.catSitter = catSitter;
    }
}
```

```java title="LitterBoxFunctions.java"
public class LitterBoxFunctions {
    private final CatSitter catSitter;
    
    public LitterBoxFunctions(CatSitter catSitter) {  // Fails; Can't find injectable CatFunctions instance
        this.catSitter = catSitter;
    }
}
```

